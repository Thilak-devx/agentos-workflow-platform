import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type Shortcut = {
  key: string;
  action: string;
};

type KeyboardShortcutsCardProps = {
  shortcuts: Shortcut[];
};

export function KeyboardShortcutsCard({
  shortcuts,
}: KeyboardShortcutsCardProps) {
  return (
    <GlassCard className="p-5" glow="violet">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Keyboard shortcuts</h2>
        <Badge variant="violet">Operator speed</Badge>
      </div>
      <div className="space-y-3">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.key}
            className="flex items-center justify-between rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3"
          >
            <span className="text-sm text-white/68">{shortcut.action}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] tracking-[0.18em] text-white/42 uppercase">
              {shortcut.key}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
