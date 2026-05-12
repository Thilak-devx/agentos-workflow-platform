insert into public.operator_settings (
  id,
  "notificationPrefs",
  "workspaceMode",
  "approvalThreshold",
  theme,
  "commandHintsEnabled"
)
values (
  'primary',
  '{"incident": true, "digest": true, "review": false}'::jsonb,
  'Balanced',
  72,
  'dark',
  true
)
on conflict (id) do nothing;

insert into public.notifications (id, title, detail, tone, source, "createdAt")
values
  (
    'seed-notification-research-stable',
    'Research swarm stabilized',
    'Multi-agent reasoning is holding above 0.94 confidence.',
    'cyan',
    'system',
    timezone('utc', now()) - interval '12 minutes'
  ),
  (
    'seed-notification-treasury-healthy',
    'Treasury policy healthy',
    'All guarded payout lanes remain inside their spend envelopes.',
    'emerald',
    'treasury',
    timezone('utc', now()) - interval '26 minutes'
  ),
  (
    'seed-notification-launch-warm',
    'Launch workflow warm',
    'The active release path is ready for operator review.',
    'violet',
    'workflow',
    timezone('utc', now()) - interval '41 minutes'
  )
on conflict (id) do nothing;

insert into public.activity_logs (
  id,
  title,
  detail,
  time,
  tone,
  source,
  "createdAt"
)
values
  (
    'seed-activity-research-swarm',
    'Research swarm formed around product anomaly',
    'Signal Mapper opened a multi-agent brief and invited Ops Sentinel plus Support Relay into the same objective graph.',
    '14s',
    'cyan',
    'workflow',
    timezone('utc', now()) - interval '14 seconds'
  ),
  (
    'seed-activity-guardrail-compressed',
    'Guardrail compressed an approval path',
    'The system bypassed human review for a low-risk internal transfer after policy confidence exceeded 0.98.',
    '41s',
    'emerald',
    'treasury',
    timezone('utc', now()) - interval '41 seconds'
  ),
  (
    'seed-activity-memory-committed',
    'Memory snapshot committed after incident recovery',
    'AgentOS stored a recovery summary so future workflows inherit the successful mitigation path.',
    '3m',
    'violet',
    'system',
    timezone('utc', now()) - interval '3 minutes'
  )
on conflict (id) do nothing;

insert into public.memory_snapshots (
  id,
  title,
  detail,
  category,
  timestamp,
  "searchableText",
  "createdAt"
)
values
  (
    'seed-memory-launch-rollback',
    'Launch rollback protocol',
    'Stored after queue saturation recovery succeeded without human intervention.',
    'Recovery',
    '1h ago',
    'launch rollback protocol queue saturation recovery',
    timezone('utc', now()) - interval '1 hour'
  ),
  (
    'seed-memory-treasury-safe-path',
    'Treasury safe-path routing',
    'Saved when capital transfer confidence exceeded policy thresholds across three vaults.',
    'Treasury',
    '3h ago',
    'treasury safe path routing capital transfer confidence policy thresholds',
    timezone('utc', now()) - interval '3 hours'
  ),
  (
    'seed-memory-support-playbook',
    'High-value customer save playbook',
    'Learned from the support swarm after churn risk dropped by 42 percent in one cycle.',
    'Support',
    '5h ago',
    'high value customer save playbook churn risk support swarm',
    timezone('utc', now()) - interval '5 hours'
  )
on conflict (id) do nothing;

insert into public.workflow_runs (
  id,
  name,
  cadence,
  status,
  "lastRun",
  prompt,
  "assignedAgents",
  "stageCount",
  "estimatedCostUsd",
  "createdAt",
  "updatedAt"
)
values
  (
    'seed-workflow-launch-pipeline',
    'Launch Pipeline',
    'Continuous',
    'running',
    '4m ago',
    'Launch NFT campaign',
    '["Research Agent","Marketing Agent","Treasury Guard","Ops Sentinel"]'::jsonb,
    4,
    6400,
    timezone('utc', now()) - interval '4 hours',
    timezone('utc', now()) - interval '4 minutes'
  ),
  (
    'seed-workflow-treasury-guardrail',
    'Treasury Guardrail',
    'Every hour',
    'awaiting approval',
    '12m ago',
    'Analyze treasury risk',
    '["Treasury Guard","Security Agent","Ops Sentinel"]'::jsonb,
    3,
    3800,
    timezone('utc', now()) - interval '6 hours',
    timezone('utc', now()) - interval '12 minutes'
  ),
  (
    'seed-workflow-customer-recovery',
    'Customer Recovery',
    'Daily',
    'completed',
    '18h ago',
    'Coordinate support recovery workflow',
    '["AI Support Operator","Support Relay","Ops Sentinel"]'::jsonb,
    3,
    2100,
    timezone('utc', now()) - interval '1 day',
    timezone('utc', now()) - interval '18 hours'
  )
on conflict (id) do nothing;

insert into public.saved_workflows (
  id,
  prompt,
  workflow,
  "createdAt",
  "updatedAt"
)
values (
  'seed-saved-workflow-launch-pipeline',
  'Launch NFT campaign',
  '{
    "title": "Launch Pipeline",
    "objective": "Coordinate an NFT campaign with treasury controls, rollout sequencing, and operator approval.",
    "summary": "A multi-agent launch workflow balancing research, market timing, treasury readiness, and guarded execution.",
    "reasoning": "The workflow prioritizes signal validation first, then campaign sequencing, then treasury verification before public rollout.",
    "suggestedAgents": ["Research Agent", "Marketing Agent", "Treasury Guard", "Ops Sentinel"],
    "operationalRecommendations": [
      "Keep treasury approval inside the final release gate.",
      "Sequence community activation after channel narrative is validated.",
      "Monitor launch anomalies during the first execution window."
    ],
    "stages": [
      {
        "name": "Signal discovery",
        "goal": "Validate launch demand and segment priority cohorts.",
        "duration": "4 hours",
        "tasks": [
          {
            "title": "Map creator demand",
            "description": "Correlate creator, wallet, and community signals.",
            "assignedAgent": "Research Agent",
            "contributors": ["Marketing Agent"],
            "estimatedHours": 4,
            "estimatedCostUsd": 900
          }
        ]
      },
      {
        "name": "Go-to-market sequencing",
        "goal": "Build the campaign narrative and execution order.",
        "duration": "6 hours",
        "tasks": [
          {
            "title": "Assemble campaign lane",
            "description": "Define sequencing across creator, social, and contributor channels.",
            "assignedAgent": "Marketing Agent",
            "contributors": ["Research Agent", "Community Agent"],
            "estimatedHours": 6,
            "estimatedCostUsd": 1500
          }
        ]
      },
      {
        "name": "Treasury and release controls",
        "goal": "Verify payout envelope and rollout policy before launch.",
        "duration": "3 hours",
        "tasks": [
          {
            "title": "Verify budget and launch controls",
            "description": "Check capital routing and enforce final approval before execution.",
            "assignedAgent": "Treasury Guard",
            "contributors": ["Ops Sentinel"],
            "estimatedHours": 3,
            "estimatedCostUsd": 1200
          }
        ]
      }
    ],
    "contributorAssignments": [
      { "role": "Research lead", "owner": "Research Agent", "focus": "Demand validation" },
      { "role": "Campaign lead", "owner": "Marketing Agent", "focus": "Narrative sequencing" },
      { "role": "Treasury review", "owner": "Treasury Guard", "focus": "Capital approval" }
    ],
    "timeline": [
      { "phase": "Discovery", "duration": "4 hours", "deliverables": ["Demand brief"] },
      { "phase": "Sequencing", "duration": "6 hours", "deliverables": ["Channel plan"] },
      { "phase": "Approval", "duration": "3 hours", "deliverables": ["Launch-ready approval"] }
    ],
    "treasuryEstimates": [
      { "category": "Campaign operations", "amountUsd": 2400, "rationale": "Execution and rollout coordination" },
      { "category": "Treasury review", "amountUsd": 1200, "rationale": "Guarded approval and settlement checks" }
    ],
    "totalEstimatedCostUsd": 3600,
    "estimatedTimeline": "1-2 days"
  }'::jsonb,
  timezone('utc', now()) - interval '9 hours',
  timezone('utc', now()) - interval '9 hours'
)
on conflict (id) do nothing;

insert into public.agents (
  slug,
  name,
  type,
  role,
  status,
  "currentTask",
  "successRate",
  confidence,
  "walletPermissions",
  "memoryState",
  "treasuryAccessLevel",
  "linkedWorkflows",
  telemetry,
  tone,
  summary,
  "executionHistory",
  "reasoningLogs",
  "memorySnapshots",
  "communicationFeed",
  "createdAt",
  "updatedAt",
  online
)
values
  (
    'research-agent',
    'Research Agent',
    'Research Agent',
    'Discovers signal, synthesizes context, and produces strategy briefs.',
    'Active',
    'Mapping creator demand signals for the NFT launch narrative.',
    '96.4%',
    '0.94',
    'Read-only treasury visibility',
    'Long-horizon market memory loaded',
    'Observational',
    '["Research Swarm","Launch Pipeline","Growth Campaign"]'::jsonb,
    '{"executions24h":"1284 tasks","avgLatency":"210ms","collaborationLoad":"12 live threads"}'::jsonb,
    'cyan',
    'The Research Agent acts as the strategic sensing layer, turning noisy external signals into actionable operating intelligence.',
    '[{"id":"research-execution-market-brief","title":"Market brief compiled","result":"Identified three high-conviction audience segments.","time":"07m ago","tone":"cyan"}]'::jsonb,
    '[{"id":"research-reasoning-creator-demand","summary":"Confidence increased after matching creator demand with low-friction wallet conversion cohorts.","confidence":"0.94"}]'::jsonb,
    '[{"id":"research-memory-creator-segment","title":"High-conviction creator segment","detail":"Saved after creator overlap rose across launch and community datasets."}]'::jsonb,
    '[{"id":"research-comm-demand-map","title":"Shared demand map with Marketing Agent","detail":"Pushed ranked audience priorities into the growth execution graph.","time":"02m","tone":"cyan"}]'::jsonb,
    timezone('utc', now()) - interval '10 hours',
    timezone('utc', now()) - interval '8 minutes',
    true
  ),
  (
    'automation-controller',
    'Automation Controller',
    'Developer Agent',
    'Sequences multi-step execution pipelines and resolves workflow retries automatically.',
    'Coordinating',
    'Supervising multi-step task pipelines across launch and treasury workflows.',
    '93.8%',
    '0.90',
    'No direct transfer permissions',
    'Release patterns and rollback playbooks active',
    'None',
    '["Launch Pipeline","DAO Contributor Workflow"]'::jsonb,
    '{"executions24h":"312 builds","avgLatency":"380ms","collaborationLoad":"8 release paths"}'::jsonb,
    'violet',
    'The Automation Controller keeps cross-agent execution inside guarded operational lanes.',
    '[{"id":"automation-execution-release-candidate","title":"Release candidate stabilized","result":"Resolved queue contention before rollout approval.","time":"05m ago","tone":"emerald"}]'::jsonb,
    '[{"id":"automation-reasoning-release-path","summary":"Current release path is safe if deployment remains inside the lower-latency pool.","confidence":"0.90"}]'::jsonb,
    '[{"id":"automation-memory-rollback-safe-queue","title":"Rollback-safe queue configuration","detail":"Captured after successful deploy reroute without customer interruption."}]'::jsonb,
    '[{"id":"automation-comm-rollout-envelope","title":"Synced rollout envelope with Security Agent","detail":"Shared deploy preview to validate access and runtime guardrails.","time":"03m","tone":"emerald"}]'::jsonb,
    timezone('utc', now()) - interval '8 hours',
    timezone('utc', now()) - interval '5 minutes',
    true
  ),
  (
    'treasury-analyst-agent',
    'Treasury Analyst Agent',
    'Treasury Agent',
    'Analyzes treasury posture, budget allocation, and payout risk before execution.',
    'Monitoring',
    'Reviewing vault allocation drift after the latest devnet settlement cycle.',
    '97.2%',
    '0.97',
    'Protected transfer authority',
    'Treasury safety rails and payout history active',
    'Guarded execution',
    '["Treasury Guardrail","Growth Spend Allocation"]'::jsonb,
    '{"executions24h":"74 settlement actions","avgLatency":"190ms","collaborationLoad":"4 guarded vaults"}'::jsonb,
    'emerald',
    'The Treasury Analyst Agent acts as the financial operating layer for autonomous execution.',
    '[{"id":"treasury-execution-payout-simulation","title":"Payout simulation validated","result":"Approved three contributor disbursement lanes without policy drift.","time":"08m ago","tone":"emerald"}]'::jsonb,
    '[{"id":"treasury-reasoning-spend-safe","summary":"Spend is safe to expand if contributor payouts stay under the forecasted launch envelope.","confidence":"0.97"}]'::jsonb,
    '[{"id":"treasury-memory-safe-path-payout","title":"Safe-path payout lane","detail":"Persisted after three consecutive routing approvals without manual escalation."}]'::jsonb,
    '[{"id":"treasury-comm-budget-envelope","title":"Budget envelope shared with Marketing Agent","detail":"Aligned spend bounds with growth campaign acceleration paths.","time":"04m","tone":"emerald"}]'::jsonb,
    timezone('utc', now()) - interval '7 hours',
    timezone('utc', now()) - interval '6 minutes',
    true
  ),
  (
    'ai-support-operator',
    'AI Support Operator',
    'Community Agent',
    'Routes customer escalations, compresses issue context, and prepares operator approvals.',
    'Active',
    'Reducing churn-risk escalations across the review queue.',
    '89.7%',
    '0.87',
    'Contributor payout visibility',
    'Contributor sentiment memory adapting',
    'Observed payout state',
    '["Customer Recovery","Growth Campaign"]'::jsonb,
    '{"executions24h":"612 coordination actions","avgLatency":"290ms","collaborationLoad":"19 contributor clusters"}'::jsonb,
    'cyan',
    'The AI Support Operator manages trust, escalation clarity, and contributor alignment.',
    '[{"id":"support-execution-routing","title":"Contributor routing plan refreshed","result":"Matched communication cadence to payout timing and task readiness.","time":"10m ago","tone":"cyan"}]'::jsonb,
    '[{"id":"support-reasoning-payout-visibility","summary":"Contributor morale improves when payout visibility is paired with clearer execution sequencing.","confidence":"0.87"}]'::jsonb,
    '[{"id":"support-memory-trust-trigger","title":"Contributor trust trigger","detail":"Stored after trust recovered quickly when execution status became transparent."}]'::jsonb,
    '[{"id":"support-comm-payout-transparency","title":"Requested payout transparency snapshot","detail":"Asked Treasury Agent for contributor-safe settlement visibility.","time":"15m","tone":"cyan"}]'::jsonb,
    timezone('utc', now()) - interval '9 hours',
    timezone('utc', now()) - interval '7 minutes',
    true
  )
on conflict (slug) do nothing;
