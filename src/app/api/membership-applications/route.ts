import { createAdminClient } from "@/lib/supabase/admin";

const areaOfInterestOptions = [
  "Human Development & Education",
  "Humanitarian & Community Welfare",
  "Research & Content Creation",
  "Event Coordination",
] as const;

const availabilityOptions = [
  "1–3 hours / week",
  "4–8 hours / week",
  "Event-based availability",
] as const;

type MembershipApplicationInput = {
  fullName: string;
  email: string;
  phone: string | null;
  country: string;
  city: string;
  skills: string | null;
  areaOfInterest: (typeof areaOfInterestOptions)[number];
  whyJoin: string;
  availability: (typeof availabilityOptions)[number];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOption<const T extends readonly string[]>(
  value: unknown,
  options: T,
): value is T[number] {
  return typeof value === "string" && options.some((option) => option === value);
}

function parseApplication(
  value: unknown,
): MembershipApplicationInput | null {
  if (!isRecord(value)) return null;

  const {
    fullName,
    email,
    phone,
    country,
    location,
    skills,
    areaOfInterest,
    whyJoin,
    availability,
  } = value;

  if (
    typeof fullName !== "string" ||
    fullName.trim().length < 2 ||
    fullName.trim().length > 150 ||
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    (phone !== undefined &&
      phone !== null &&
      (typeof phone !== "string" || phone.trim().length > 40)) ||
    typeof country !== "string" ||
    country.trim().length < 1 ||
    country.trim().length > 100 ||
    typeof location !== "string" ||
    location.trim().length < 1 ||
    location.trim().length > 150 ||
    (skills !== undefined &&
      skills !== null &&
      (typeof skills !== "string" || skills.trim().length > 2000)) ||
    !isOption(areaOfInterest, areaOfInterestOptions) ||
    typeof whyJoin !== "string" ||
    whyJoin.trim().length < 1 ||
    whyJoin.trim().length > 5000 ||
    !isOption(availability, availabilityOptions)
  ) {
    return null;
  }

  return {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone:
      typeof phone === "string" && phone.trim()
        ? phone.trim()
        : null,
    country: country.trim(),
    city: location.trim(),
    skills:
      typeof skills === "string" && skills.trim()
        ? skills.trim()
        : null,
    areaOfInterest,
    whyJoin: whyJoin.trim(),
    availability,
  };
}

export async function POST(request: Request) {
  // Reject oversized requests before parsing JSON.
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (contentLength > 16_000) {
    return Response.json(
      { error: "Application submission is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const application = parseApplication(payload);

  if (!application) {
    return Response.json(
      { error: "Please check the application fields and try again." },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("membership_applications")
      .insert({
        name: application.fullName,
        email: application.email,
        phone: application.phone,
        country: application.country,
        city: application.city,
        skills: application.skills,
        area_of_interest: application.areaOfInterest,
        reason_for_joining: application.whyJoin,
        availability: application.availability,
      })
      .select("reference_number")
      .single();

    if (error || !data) {
      console.error(
        "Unable to save membership application:",
        error?.message ?? "No application record returned.",
      );

      return Response.json(
        { error: "We could not save your application. Please try again." },
        { status: 500 },
      );
    }

    return Response.json(
      { referenceNumber: data.reference_number },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Membership application endpoint failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return Response.json(
      { error: "A server error occurred. Please try again later." },
      { status: 500 },
    );
  }
}