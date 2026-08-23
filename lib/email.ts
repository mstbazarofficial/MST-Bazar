const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export type EmailRecipient = {
  email: string;
  name?: string;
};

export type SendEmailPayload = {
  to: string | EmailRecipient[];
  subject?: string;
  htmlContent?: string;
  templateId?: number;
  params?: Record<string, any>;
};

/**
 * Universal Brevo Email Sending Function
 * Supports both custom HTML strings and Brevo Hosted Templates.
 */
export async function sendEmail({
  to,
  subject,
  htmlContent,
  templateId,
  params,
}: SendEmailPayload) {
  const recipients: EmailRecipient[] =
    typeof to === "string" ? [{ email: to }] : to;

  const payload: Record<string, any> = {
    sender: {
      name: process.env.SENDER_NAME,
      email: process.env.SENDER_EMAIL,
    },
    to: recipients,
  };

  if (templateId) {
    payload.templateId = templateId;
    if (params) payload.params = params;
  } else if (htmlContent && subject) {
    payload.subject = subject;
    payload.htmlContent = htmlContent;
  } else {
    throw new Error(
      "You must provide either a templateId or both subject and htmlContent.",
    );
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify(payload),
  });

  // Read response stream ONCE
  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Brevo Email Sending Error:", responseData);
    throw new Error(responseData.message || "Failed to send email");
  }

  // Return already parsed JSON
  return responseData;
}
