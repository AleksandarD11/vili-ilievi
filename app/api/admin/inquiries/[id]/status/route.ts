import { NextResponse } from "next/server";

import type { InquiryStatus } from "@/lib/site-data";
import { sendStatusUpdateEmail } from "@/lib/server/emailjs";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

const tableName = "inquiries";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json()) as {
    status: InquiryStatus;
    email: string;
    firstName: string;
    lastName: string;
    houseName: string;
    checkIn: string;
    checkOut: string;
  };

  if (!body.status || !body.email || !body.firstName || !body.lastName) {
    return NextResponse.json({ error: "Missing data for status notification." }, { status: 400 });
  }

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from(tableName).update({ status: body.status }).eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Unable to update reservation status." }, { status: 500 });
    }
  }

  try {
    await sendStatusUpdateEmail({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      status: body.status,
      houseName: body.houseName,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
    });
  } catch (mailError) {
    return NextResponse.json(
      {
        error:
          mailError instanceof Error
            ? mailError.message
            : "Status update email could not be sent.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
