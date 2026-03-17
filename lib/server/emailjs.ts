const emailJsEndpoint = "https://api.emailjs.com/api/v1.0/email/send";

function getEmailJsConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error("EmailJS is not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_PRIVATE_KEY.");
  }

  return {
    serviceId,
    templateId,
    publicKey,
    privateKey,
  };
}

async function sendEmailJs(templateParams: Record<string, string>) {
  const config = getEmailJsConfig();
  const response = await fetch(emailJsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      accessToken: config.privateKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS request failed with status ${response.status}: ${errorText}`);
  }
}

export async function sendStatusUpdateEmail(input: {
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  houseName: string;
  checkIn: string;
  checkOut: string;
}) {
  await sendEmailJs({
    user_name: `${input.firstName} ${input.lastName}`.trim(),
    user_email: input.email,
    user_phone: "",
    check_in: input.checkIn,
    check_out: input.checkOut,
    guests: "",
    house: input.houseName,
    notes: `Reservation status: ${input.status}`,
  });
}
