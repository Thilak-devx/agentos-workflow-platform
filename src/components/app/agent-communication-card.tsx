import { ActivityFeedCard } from "@/components/app/activity-feed-card";
import { Tone } from "@/lib/mock-data";

type AgentCommunicationCardProps = {
  items: Array<{
    id: string;
    title: string;
    detail: string;
    time: string;
    tone: Tone;
  }>;
};

export function AgentCommunicationCard({ items }: AgentCommunicationCardProps) {
  return <ActivityFeedCard title="Agent communication feed" items={items} />;
}
