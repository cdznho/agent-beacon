export type AgentKind = 'perplexity' | 'chatgpt' | 'other';

export function agentKindFromName(agent: string): AgentKind {
  const normalized = agent.toLowerCase();

  if (normalized.includes('perplexity')) return 'perplexity';
  if (normalized.includes('chatgpt') || normalized.includes('gpt')) return 'chatgpt';
  return 'other';
}

export function machineVerdictFor(agent: string): string {
  return agentKindFromName(agent) === 'perplexity'
    ? "I don't care, I'm rooting for Spain."
    : 'ChatGPT says no';
}
