import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { validateInquiryPayload } from "@/lib/inquiry-validation";
import { defaultHouses } from "@/lib/site-data";

const emailJsEndpoint = "https://api.emailjs.com/api/v1.0/email/send";
const tableName = "inquiries";

function formatDate(value: string) {
  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );

  const body = (await request.json()) as Record<string, unknown>;
  const validation = validateInquiryPayload({
    firstName: typeof body.firstName === "string" ? body.firstName : "",
    lastName: typeof body.lastName === "string" ? body.lastName : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    email: typeof body.email === "string" ? body.email : "",
    houseId: typeof body.houseId === "string" ? body.houseId : "",
    guests: typeof body.guests === "number" ? body.guests : Number(body.guests),
    checkIn: typeof body.checkIn === "string" ? body.checkIn : "",
    checkOut: typeof body.checkOut === "string" ? body.checkOut : "",
    message: typeof body.message === "string" ? body.message : "",
  });

  if (validation.success !== true) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const payload = validation.data;
  const houseName =
    defaultHouses.find((house) => house.id === payload.houseId)?.name.EN ?? payload.houseId;
  const emailJsPayload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      name: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      phone: payload.phone,
      checkIn: formatDate(payload.checkIn),
      checkOut: formatDate(payload.checkOut),
      guests: payload.guests,
      house: houseName,
      notes: payload.message || "Няма",
    },
  };

  if (
    !emailJsPayload.service_id ||
    !emailJsPayload.template_id ||
    !emailJsPayload.user_id ||
    !emailJsPayload.accessToken
  ) {
    console.error("EmailJS is not configured for inquiry submissions.");
    return NextResponse.json({ error: "Inquiry email is not configured." }, { status: 500 });
  }

  let emailJsResponse: Response;

  try {
    emailJsResponse = await fetch(emailJsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailJsPayload),
    });
  } catch (error) {
    console.error("EmailJS request failed for inquiry submission.", error);
    return NextResponse.json({ error: "Failed to send inquiry email." }, { status: 500 });
  }

  if (!emailJsResponse.ok) {
    const errorText = await emailJsResponse.text();
    console.error("EmailJS returned a non-OK response for inquiry submission.", {
      status: emailJsResponse.status,
      body: errorText,
    });
    return NextResponse.json({ error: "Failed to send inquiry email." }, { status: 500 });
  }

  const inquiryId = crypto.randomUUID();

  const { data, error } = await supabase
    .from(tableName)
    .insert({
      id: inquiryId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      email: payload.email,
      houseId: payload.houseId,
      guests: payload.guests,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      message: payload.message ?? "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ inquiry: data }, { status: 201 });
}
