import { NextResponse } from "next/server";
import { contactRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export async function POST(request: Request) {
  try {
    // Protect the API from excessively large requests.
    const contentLength = request.headers.get("content-length");

    if (contentLength) {
      const size = Number(contentLength);

      if (Number.isFinite(size) && size > 20_000) {
        return NextResponse.json(
          {
            success: false,
            message: "Request is too large.",
          },
          { status: 413 }
        );
      }
    }

    // Apply rate limiting when Upstash is configured.
    if (contactRateLimit) {
      const ip = getClientIp(request);

      const { success } = await contactRateLimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Too many requests. Please wait a few minutes before trying again.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": "600",
            },
          }
        );
      }
    }

    // Read the submitted JSON.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request.",
        },
        { status: 400 }
      );
    }

    // Validate the data on the server.
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the information you submitted.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, message } = result.data;

    // Email delivery will be connected later.
    console.log("Contact form submission received:", {
      fullName,
      email,
      messageLength: message.length,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your request.",
      },
      { status: 500 }
    );
  }
}