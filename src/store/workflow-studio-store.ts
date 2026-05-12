"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createRuntimeEntityId } from "@/lib/react-keys";
import {
  SavedWorkflow,
  WorkflowGenerationResult,
} from "@/lib/workflow-generation";

type WorkflowStudioState = {
  promptHistory: string[];
  savedWorkflows: SavedWorkflow[];
  pinnedWorkflowIds: string[];
  archivedWorkflowIds: string[];
  addPromptToHistory: (prompt: string) => void;
  saveWorkflow: (prompt: string, workflow: WorkflowGenerationResult) => void;
  togglePinnedWorkflow: (id: string) => void;
  toggleArchivedWorkflow: (id: string) => void;
};

export const useWorkflowStudioStore = create<WorkflowStudioState>()(
  persist(
    (set) => ({
      promptHistory: [],
      savedWorkflows: [],
      pinnedWorkflowIds: [],
      archivedWorkflowIds: [],
      addPromptToHistory: (prompt) =>
        set((state) => ({
          promptHistory: [
            prompt,
            ...state.promptHistory.filter((item) => item !== prompt),
          ].slice(0, 8),
        })),
      saveWorkflow: (prompt, workflow) =>
        set((state) => ({
          savedWorkflows: [
            {
              id: createRuntimeEntityId("workflow-studio"),
              prompt,
              createdAt: new Date().toISOString(),
              workflow,
            },
            ...state.savedWorkflows,
          ].slice(0, 8),
        })),
      togglePinnedWorkflow: (id) =>
        set((state) => ({
          pinnedWorkflowIds: state.pinnedWorkflowIds.includes(id)
            ? state.pinnedWorkflowIds.filter((item) => item !== id)
            : [id, ...state.pinnedWorkflowIds].slice(0, 6),
        })),
      toggleArchivedWorkflow: (id) =>
        set((state) => ({
          archivedWorkflowIds: state.archivedWorkflowIds.includes(id)
            ? state.archivedWorkflowIds.filter((item) => item !== id)
            : [id, ...state.archivedWorkflowIds].slice(0, 8),
        })),
    }),
    {
      name: "agentos-workflow-studio",
    },
  ),
);
