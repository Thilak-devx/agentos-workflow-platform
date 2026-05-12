import { NextRequest } from "next/server";
import { getOpenAIClient, workflowModel } from "@/lib/openai";
import {
  extractJsonObject,
  normalizeWorkflowResult,
} from "@/lib/workflow-generation";

export const runtime = "nodejs";
const GENERIC_FAILURE_MESSAGE = "AI reasoning temporarily unavailable.";

const WORKFLOW_SYSTEM_PROMPT = `
You are AgentOS, an AI workflow strategist operating inside a premium command center for autonomous organizations.

Given a user prompt, generate a pragmatic operational workflow in JSON only.
The workflow should feel realistic for startup, DAO, product, growth, or onchain operations.

Return valid JSON with this exact shape:
{
  "title": string,
  "objective": string,
  "summary": string,
  "reasoning": string,
  "suggestedAgents": string[],
  "operationalRecommendations": string[],
  "stages": [
    {
      "name": string,
      "goal": string,
      "duration": string,
      "tasks": [
        {
          "title": string,
          "description": string,
          "assignedAgent": string,
          "contributors": string[],
          "estimatedHours": number,
          "estimatedCostUsd": number
        }
      ]
    }
  ],
  "contributorAssignments": [
    {
      "role": string,
      "owner": string,
      "focus": string
    }
  ],
  "timeline": [
    {
      "phase": string,
      "duration": string,
      "deliverables": string[]
    }
  ],
  "treasuryEstimates": [
    {
      "category": string,
      "amountUsd": number,
      "rationale": string
    }
  ],
  "totalEstimatedCostUsd": number,
  "estimatedTimeline": string
}

Rules:
- Be specific and operational.
- Include realistic AI agent names and contributor roles.
- Use concise but premium language.
- Include 3 to 6 stages.
- Keep output JSON only. No markdown fences unless absolutely necessary.
`.trim();

function streamLine(
  controller: ReadableStreamDefaultController,
  payload: unknown,
) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
}

export async function POST(request: NextRequest) {
  const { prompt } = (await request.json()) as { prompt?: string };

  if (!prompt?.trim()) {
    return Response.json(
      { error: "A workflow prompt is required." },
      { status: 400 },
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        streamLine(controller, {
          type: "status",
          phase: "connecting",
          message: "Connecting to OpenAI workflow engine",
        });

        const client = getOpenAIClient();
        const responseStream = await client.responses.create({
          model: workflowModel,
          stream: true,
          reasoning: { effort: "medium" },
          instructions: WORKFLOW_SYSTEM_PROMPT,
          input: prompt,
        });

        let fullText = "";

        for await (const event of responseStream) {
          if (event.type === "response.output_text.delta") {
            fullText += event.delta;
            streamLine(controller, {
              type: "status",
              phase: "streaming",
              message: "Streaming workflow analysis",
            });
            streamLine(controller, { type: "delta", delta: event.delta });
          }
        }

        const parsed = JSON.parse(extractJsonObject(fullText));
        const workflow = normalizeWorkflowResult(parsed);

        streamLine(controller, {
          type: "status",
          phase: "recovered",
          message: "Workflow generation completed",
        });
        streamLine(controller, { type: "workflow", workflow });
        streamLine(controller, { type: "done" });
        controller.close();
      } catch (error) {
        console.error("Workflow generation stream failed", error);
        streamLine(controller, {
          type: "status",
          phase: "unavailable",
          message: GENERIC_FAILURE_MESSAGE,
        });
        streamLine(controller, { type: "error", recoverable: true });
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
