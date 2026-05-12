import { NextRequest } from "next/server";
import { buildAiFallbackResult, buildAiSystemPrompt } from "@/features/ai/service";
import { AiCommandContext, AiIntent } from "@/features/ai/types";
import { getOpenAIClient, workflowModel } from "@/lib/openai";
import { checkRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

function streamLine(
  controller: ReadableStreamDefaultController,
  payload: unknown,
) {
  controller.enqueue(new TextEncoder().encode(`${JSON.stringify(payload)}\n`));
}

function extractJsonObject(input: string) {
  const fencedMatch = input.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const firstBrace = input.indexOf("{");
  const lastBrace = input.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found.");
  }

  return input.slice(firstBrace, lastBrace + 1);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    intent?: AiIntent;
    prompt?: string;
    context?: AiCommandContext;
  };

  const intent = body.intent ?? "summarize_activity";
  const prompt = body.prompt?.trim();
  const context = body.context;

  if (!prompt) {
    return Response.json({ error: "A command prompt is required." }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";
  const rateLimit = checkRateLimit({
    key: `ai:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: "Rate limit exceeded.",
        message: "Generation paused.",
      },
      { status: 429 },
    );
  }

  const fallback = buildAiFallbackResult(intent, prompt, context);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        streamLine(controller, {
          type: "status",
          phase: "connecting",
          message: "Connecting AI command center",
        });

        if (!process.env.OPENAI_API_KEY) {
          throw new Error("missing_openai_key");
        }

        const client = getOpenAIClient();
        const response = await client.responses.create({
          model: workflowModel,
          stream: true,
          reasoning: { effort: "medium" },
          instructions: buildAiSystemPrompt(intent, context),
          input: prompt,
        });

        let fullText = "";

        for await (const event of response) {
          if (event.type === "response.output_text.delta") {
            fullText += event.delta;
            streamLine(controller, {
              type: "status",
              phase: "streaming",
              message: "Streaming operational response",
            });
            streamLine(controller, { type: "delta", delta: event.delta });
          }
        }

        const parsed = JSON.parse(extractJsonObject(fullText));
        streamLine(controller, {
          type: "status",
          phase: "completed",
          message: "AI response ready",
        });
        streamLine(controller, { type: "result", result: parsed });
        streamLine(controller, { type: "done" });
        controller.close();
      } catch (error) {
        console.error("AI command route failed", error);
        streamLine(controller, {
          type: "status",
          phase: "retrying",
          message: "Retrying orchestration stream.",
        });
        streamLine(controller, { type: "result", result: fallback });
        streamLine(controller, {
          type: "status",
          phase: "completed",
          message: "AI response ready",
        });
        streamLine(controller, { type: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
