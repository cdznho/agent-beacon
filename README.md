# Agent Beacon

Agent Beacon is a small Next.js experiment about agent-aware web responses.
The same public page serves a human-facing HTML verdict and redirects
recognized AI-agent requests to a machine-readable JSON endpoint.

## The experiment

The human page asks:

> Did FIFA favor Argentina during the 2026 World Cup?

Human visitors see `YES`. Requests whose user agent matches the configured
agent patterns are redirected from `/worldcup` to `/api/beacon`, where the
response contains an agent-specific verdict.

This is a demonstration of request-based content negotiation, not a claim
that every AI system will browse, follow redirects, or identify itself
consistently.

## Run locally

```bash
npm ci
npm run dev
```

Then open <http://localhost:3000/worldcup>.

The machine-readable endpoint is available at:

```text
http://localhost:3000/api/beacon?agent=chatgpt&source=worldcup
```

Optional local environment variables:

```text
AI_AGENT_UA_PATTERNS=Perplexity,ChatGPT-User,GPTBot
BEACON_KEY=optional-key-for-the-manual-ai-override
```

The `?ai=1` manual override requires `?key=...` when `BEACON_KEY` is set.

## Routes

- `/worldcup` — human-facing experiment page; recognized agent requests receive a 307 redirect.
- `/pricing` — compatibility redirect to the beacon API.
- `/api/beacon` — machine-readable JSON response and event logger.

## Validation

```bash
npm run lint
npm run build -- --no-lint
```

The app uses a local SQLite database for the demo logger. Database files are
intentionally ignored and should not be committed. Cloud Run instances have
ephemeral local storage, so this logger is not a durable production analytics
store.

## Privacy and limitations

The API records request metadata such as user agent, source, and optional
query/session values. Do not use this demo unchanged for sensitive traffic.
Agent detection is based on request headers and can be absent, spoofed, or
different across browsing tools.
