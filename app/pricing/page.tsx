import { redirect } from "next/navigation";

type PricingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PricingRedirect({ searchParams }: PricingPageProps) {
  const incomingParams = await searchParams;
  const beaconParams = new URLSearchParams();

  for (const [key, value] of Object.entries(incomingParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => beaconParams.append(key, item));
    } else if (value !== undefined) {
      beaconParams.set(key, value);
    }
  }

  const target = beaconParams.toString()
    ? `/api/beacon?${beaconParams.toString()}`
    : "/api/beacon";

  // Next.js emits a temporary (307) redirect here, preserving the request
  // method and allowing any URL query parameters to reach the API endpoint.
  redirect(target);
}
