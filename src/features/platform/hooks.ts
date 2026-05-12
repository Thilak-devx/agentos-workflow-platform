"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  createAgentRecord,
  getPlatformSnapshot,
  hasKnownMissingPlatformTables,
  resetOrchestrationMemory,
  revokeOtherSessions,
  saveGeneratedWorkflow,
  updateNotificationPreference,
  updateOperatorSettings,
} from "@/features/platform/service";
import {
  NotificationPreferenceKey,
  OperatorIdentity,
  OperatorSettings,
  WorkflowPersistenceInput,
} from "@/features/platform/types";

export const platformQueryKey = ["platform-snapshot"];

export function usePlatformSnapshot(operator?: OperatorIdentity) {
  return useQuery({
    queryKey: [...platformQueryKey, operator?.id ?? "default"],
    queryFn: () => getPlatformSnapshot(operator),
    staleTime: 10_000,
    refetchInterval: hasKnownMissingPlatformTables() ? false : 15_000,
    refetchIntervalInBackground: false,
  });
}

export function usePlatformActions(operator?: OperatorIdentity) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [...platformQueryKey, operator?.id ?? "default"],
    });

  const saveWorkflowMutation = useMutation({
    mutationFn: (input: WorkflowPersistenceInput) => saveGeneratedWorkflow(input),
    onSuccess: invalidate,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Partial<OperatorSettings>) =>
      updateOperatorSettings(settings),
    onSuccess: invalidate,
  });

  const updateNotificationPreferenceMutation = useMutation({
    mutationFn: ({
      key,
      value,
    }: {
      key: NotificationPreferenceKey;
      value: boolean;
    }) => updateNotificationPreference(key, value),
    onSuccess: invalidate,
  });

  const createAgentMutation = useMutation({
    mutationFn: createAgentRecord,
    onSuccess: invalidate,
  });

  const revokeSessionsMutation = useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: invalidate,
  });

  const resetMemoryMutation = useMutation({
    mutationFn: resetOrchestrationMemory,
    onSuccess: invalidate,
  });

  const switchWorkspaceMutation = useMutation({
    mutationFn: (workspace: import("@/features/platform/types").WorkspaceRecord) =>
      import("@/features/platform/service").then((module) =>
        module.switchWorkspace(workspace),
      ),
    onSuccess: invalidate,
  });

  return {
    saveWorkflowMutation,
    updateSettingsMutation,
    updateNotificationPreferenceMutation,
    createAgentMutation,
    revokeSessionsMutation,
    resetMemoryMutation,
    switchWorkspaceMutation,
  };
}

export function useWorkflowOperations(operator?: OperatorIdentity) {
  const snapshotQuery = usePlatformSnapshot(operator);
  const actions = usePlatformActions(operator);

  const data = useMemo(
    () => ({
      workflows: snapshotQuery.data?.workflowRuns ?? [],
      savedWorkflows: snapshotQuery.data?.savedWorkflows ?? [],
      orchestrationTasks: snapshotQuery.data?.orchestrationTasks ?? [],
      activityLogs: snapshotQuery.data?.activityLogs ?? [],
      memorySnapshots: snapshotQuery.data?.memorySnapshots ?? [],
    }),
    [snapshotQuery.data],
  );

  return {
    ...snapshotQuery,
    ...data,
    saveWorkflow: actions.saveWorkflowMutation.mutateAsync,
    isSavingWorkflow: actions.saveWorkflowMutation.isPending,
  };
}
