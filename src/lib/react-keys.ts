export function createStableKey(
  ...parts: Array<string | number | null | undefined>
) {
  return parts
    .filter((part) => part !== null && part !== undefined && part !== "")
    .map((part) => String(part).trim().replace(/\s+/g, "-"))
    .join("__");
}

export function createRuntimeEntityId(prefix = "entity") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
