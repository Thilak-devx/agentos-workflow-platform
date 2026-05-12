"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClientOrNull } from "@/features/platform/supabase";
import { defaultOperatorIdentity } from "@/features/platform/seed";
import { OperatorIdentity } from "@/features/platform/types";

type OperatorContextValue = {
  operator: OperatorIdentity;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const OperatorContext = createContext<OperatorContextValue | null>(null);

type OperatorProviderProps = {
  children: React.ReactNode;
};

function buildOperatorIdentityFromSupabase(
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  },
): OperatorIdentity {
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : defaultOperatorIdentity.fullName;
  const workspaceName =
    typeof user.user_metadata?.workspace_name === "string"
      ? user.user_metadata.workspace_name
      : defaultOperatorIdentity.workspaceName;
  const workspaceId =
    typeof user.user_metadata?.workspace_id === "string"
      ? user.user_metadata.workspace_id
      : defaultOperatorIdentity.workspaceId;
  const role =
    typeof user.user_metadata?.role === "string"
      ? user.user_metadata.role
      : defaultOperatorIdentity.role;
  const avatarLabel =
    typeof user.user_metadata?.avatar_label === "string"
      ? user.user_metadata.avatar_label
      : fullName
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

  return {
    id: user.id,
    fullName,
    email: user.email ?? defaultOperatorIdentity.email,
    workspaceName,
    workspaceId,
    avatarLabel,
    role,
    authSource: "supabase",
    sessionState: "authenticated",
  };
}

export function OperatorProvider({ children }: OperatorProviderProps) {
  const [operator, setOperator] = useState<OperatorIdentity>({
    ...defaultOperatorIdentity,
    sessionState: "loading",
  });
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    const client = getSupabaseBrowserClientOrNull();

    if (!client) {
      setOperator(defaultOperatorIdentity);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      setOperator(
        user ? buildOperatorIdentityFromSupabase(user) : defaultOperatorIdentity,
      );
    } catch {
      setOperator(defaultOperatorIdentity);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const client = getSupabaseBrowserClientOrNull();

    queueMicrotask(() => {
      void refresh();
    });

    if (!client) return;

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setOperator(
        user ? buildOperatorIdentityFromSupabase(user) : defaultOperatorIdentity,
      );
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      operator,
      isLoading,
      refresh,
    }),
    [operator, isLoading],
  );

  return (
    <OperatorContext.Provider value={value}>
      {children}
    </OperatorContext.Provider>
  );
}

export function useOperatorSession() {
  const context = useContext(OperatorContext);
  if (!context) {
    throw new Error("useOperatorSession must be used inside OperatorProvider.");
  }

  return context;
}
