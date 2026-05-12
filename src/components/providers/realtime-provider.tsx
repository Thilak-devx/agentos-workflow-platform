"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  PLATFORM_TABLES,
} from "@/features/platform/schema";
import {
  hasKnownMissingPlatformTables,
} from "@/features/platform/service";
import { platformQueryKey } from "@/features/platform/hooks";
import { getSupabaseBrowserClientOrNull } from "@/features/platform/supabase";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { useRuntimeStore } from "@/store/runtime-store";

type RealtimeProviderProps = {
  children: React.ReactNode;
};

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const queryClient = useQueryClient();
  const { operator } = useOperatorSession();
  const pushToast = useRuntimeStore((state) => state.pushToast);

  useEffect(() => {
    const client = getSupabaseBrowserClientOrNull();
    if (!client || operator.sessionState !== "authenticated") return;
    if (hasKnownMissingPlatformTables()) return;

    const invalidatePlatform = () =>
      queryClient.invalidateQueries({
        queryKey: [...platformQueryKey, operator.id],
      });

    const dataChannel = client
      .channel(`agentos-platform-${operator.workspaceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: PLATFORM_TABLES.notifications },
        () => {
          invalidatePlatform();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: PLATFORM_TABLES.activityLogs },
        () => {
          invalidatePlatform();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: PLATFORM_TABLES.workflowRuns },
        () => {
          invalidatePlatform();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: PLATFORM_TABLES.agents },
        () => {
          invalidatePlatform();
        },
      )
      .subscribe();

    const presenceChannel = client.channel(`agentos-presence-${operator.workspaceId}`);

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const operatorCount = Object.keys(state).length;
        pushToast({
          title: "Operator presence updated",
          detail: `${operatorCount} operator${operatorCount === 1 ? "" : "s"} currently active in ${operator.workspaceName}.`,
          tone: "cyan",
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            operatorId: operator.id,
            workspaceId: operator.workspaceId,
            onlineAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      void client.removeChannel(dataChannel);
      void client.removeChannel(presenceChannel);
    };
  }, [operator, pushToast, queryClient]);

  return <>{children}</>;
}
