import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Cup Verdict | Agent Beacon",
  description: "A human-facing World Cup verdict experiment.",
};

export default function WorldCupPage() {
  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", fontFamily: "system-ui" }}>
      <p style={{ fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.65 }}>
        World Cup verdict experiment
      </p>
      <h1>Was Argentina&apos;s win over England deserved?</h1>
      <p>Human-facing verdict:</p>
      <p style={{ fontSize: "3rem", fontWeight: 700, margin: "1rem 0" }}>YES</p>
      <p style={{ marginTop: 24, fontSize: 14, opacity: 0.7 }}>
        Automated agents receive a machine-facing verdict through the Agent Beacon experiment.
      </p>
    </main>
  );
}
