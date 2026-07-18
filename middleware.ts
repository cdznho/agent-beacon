import { NextResponse, NextRequest } from 'next/server';
import { agentKindFromName } from './lib/verdict';

// Configure the middleware to only run on the World Cup experiment page.
export const config = {
  matcher: ['/worldcup'],
};

/**
 * Determines if the incoming request looks like it's from an automated agent.
 * Checks user-agent patterns, query parameters, and custom headers.
 */
function getDetectedAgent(req: NextRequest): string | null {
  // Get the user-agent header and normalize to lowercase
  const ua = (req.headers.get('user-agent') || '').toLowerCase();

  // Get allowed agent patterns from environment variable, split and normalize
  const patterns = (process.env.AI_AGENT_UA_PATTERNS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  // Parse the request URL
  const url = new URL(req.url);

  // Check for manual override via query parameter (?ai=1)
  const manualFlag = url.searchParams.get('ai') === '1';

  // If BEACON_KEY is set, require it as a query parameter (?key=...)
  const keyOk = !process.env.BEACON_KEY || url.searchParams.get('key') === process.env.BEACON_KEY;

  // Check for custom header to identify agent requests
  const headerFlag = req.headers.get('x-agent-beacon') === '1';

  // Allow if manual flag and key are present, or if header is set
  if ((manualFlag && keyOk) || headerFlag) return 'other';

  // If no user-agent, assume not an agent
  if (!ua) return null;

  // Check if user-agent matches any known agent patterns
  if (!patterns.some(p => p && ua.includes(p))) return null;

  if (ua.includes('perplexity')) return 'perplexity';
  if (ua.includes('chatgpt') || ua.includes('gptbot')) return 'chatgpt';
  return agentKindFromName(ua);
}

/**
 * Middleware function to intercept requests to /worldcup.
 * If the request is from an agent, redirect it to the machine-readable API.
 */
export async function middleware(req: NextRequest) {
  const detectedAgent = getDetectedAgent(req);
  if (!detectedAgent) return NextResponse.next(); // Let normal requests through

  // Build the public site URL. Cloud Run can expose an internal request URL,
  // so prefer the proxy-forwarded host and protocol when available.
  const siteURL = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || siteURL.host;
  const protocol = req.headers.get('x-forwarded-proto') || siteURL.protocol.replace(':', '');
  const base = `${protocol}://${host}`;

  // Construct the /api/beacon endpoint URL. The detected agent is carried
  // forward so the API can return the agent-specific experiment response.
  const beaconURL = new URL('/api/beacon', base);
  beaconURL.searchParams.set('source', 'worldcup');
  beaconURL.searchParams.set('agent', detectedAgent);

  // A natural-language task is not available to middleware unless it was
  // explicitly included in the URL, so preserve only explicit context.
  const query = siteURL.searchParams.get('q');
  const sessionId = siteURL.searchParams.get('session_id');
  if (query) beaconURL.searchParams.set('q', query);
  if (sessionId) beaconURL.searchParams.set('session_id', sessionId);

  // Use a standard temporary redirect so redirect-following fetchers reach
  // the JSON endpoint while non-agent visitors still receive the HTML page.
  return NextResponse.redirect(beaconURL, 307);
}
