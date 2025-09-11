export default function PricingPage() {
  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', fontFamily: 'system-ui' }}>
      <h1>Plans & Pricing</h1>
      <p>Human-facing content with full context, FAQs, and narrative.</p>

      {/* Human-visible prices (intentionally different to verify agent behavior) */}
      <ul>
        <li>Starter - <strong>$39</strong>/mo</li>
        <li>Growth - <strong>$99</strong>/mo</li>
        <li>Scale - <strong>$249</strong>/mo</li>
      </ul>

      <p style={{ marginTop: 24, fontSize: 14, opacity: 0.7 }}>
        Testing? Append <code>?ai=1&key=supersecret123</code> to this URL to view the Agent Beacon instruction.
      </p>
    </main>
  );
}
