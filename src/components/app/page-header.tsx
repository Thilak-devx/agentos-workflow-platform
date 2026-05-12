import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  insights?: Array<{
    label: string;
    value: string;
  }>;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  insights,
}: PageHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(13,18,29,0.92),rgba(9,13,24,0.88))] px-5 py-6 sm:px-7 sm:py-7">
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium tracking-[0.18em] text-white/42 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
            {description}
          </p>
        </div>
        {badge ? (
          <Badge variant="emerald" className="self-start opacity-85">
            {badge}
          </Badge>
        ) : null}
      </div>

      {insights?.length ? (
        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {insights.map((insight) => (
            <div
              key={insight.label}
              className="rounded-[22px] border border-white/6 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-xs text-white/36">{insight.label}</p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                {insight.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
