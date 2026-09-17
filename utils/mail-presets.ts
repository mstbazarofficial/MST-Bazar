import { SITE_CONFIG } from "@/constants/site";
import { sendEmail } from "@/lib/email";

export type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

// 1. Email Verification (Signup)
export async function sendEmailVerification({
  email,
  name,
  url,
}: {
  email: string;
  name?: string;
  url: string;
}) {
  return sendEmail({
    to: email,
    subject: "Verify your email address",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0;">Verify Your Email</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.5;">Hi ${name || "there"},</p>
        <p style="color: #475569; font-size: 15px; line-height: 1.5;">Thank you for registering. Please confirm your email address by clicking the button below:</p>
        
        <div style="margin: 28px 0;">
          <a href="${url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; font-weight: 600; border-radius: 8px; text-decoration: none; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 13px;">If you didn't request this email, you can safely ignore it.</p>
      </div>
    `,
  });
}

// 2. Forgot Password Email
export async function sendPasswordResetEmail({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  return sendEmail({
    to: email,
    subject: "Reset your password",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.5;">We received a request to reset your account password. Click the button below to set a new password:</p>
        
        <div style="margin: 28px 0;">
          <a href="${url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; font-weight: 600; border-radius: 8px; text-decoration: none; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 13px;">This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
  });
}

export type OrderConfirmationPayload = {
  orderId: string;
  customerName: string;
  emailAddress: string;
  phoneNumber: string;
  fullAddress: string;
  shippingCost: number;
  discount: number;
  orderPaymentMethod: string;
  orderItems: {
    productName: string;
    quantity: number;
    price: number;
    discountPercentage?: number;
  }[];
};

export async function sendOrderConfirmationEmail(
  order: OrderConfirmationPayload,
) {
  const trackUrl = `${SITE_CONFIG.url}/track-order?orderId=${encodeURIComponent(order.orderId)}&phone=${encodeURIComponent(order.phoneNumber)}`;
  // Calculate items total with discount snapshot considered
  const subtotal = order.orderItems.reduce((acc, item) => {
    const finalPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
    return acc + finalPrice * item.quantity;
  }, 0);

  const grandTotal = subtotal + order.shippingCost - order.discount;

  const itemsRows = order.orderItems
    .map((item) => {
      const finalUnitPrice =
        item.price * (1 - (item.discountPercentage || 0) / 100);
      const itemTotal = finalUnitPrice * item.quantity;

      return `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155;">
          ${item.productName} <span style="color: #64748b; font-size: 12px;">(x${item.quantity})</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">
          ৳${Math.round(itemTotal).toLocaleString()}
        </td>
      </tr>
    `;
    })
    .join("");

  return sendEmail({
    to: order.emailAddress,
    subject: `Order Confirmation #${order.orderId}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <!-- Header -->
        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Order Received!</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
          Hi <strong>${order.customerName}</strong>, thank you for your purchase. We have received your order <strong${order.orderId}</strong>.
        </p>

        <!-- Order Tracking Box -->
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #166534;">
            You can track your order live anytime using your Order ID: <strong>${order.orderId}</strong>
          </p>
          <a href="${trackUrl}" style="background-color: #16a34a; color: #ffffff; padding: 8px 16px; font-size: 12px; font-weight: 700; border-radius: 6px; text-decoration: none; display: inline-block;">
            Track Order
          </a>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
              <th style="padding-bottom: 8px; font-size: 11px; color: #64748b; text-transform: uppercase;">Product</th>
              <th style="padding-bottom: 8px; font-size: 11px; color: #64748b; text-transform: uppercase; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <!-- Pricing Breakdown -->
        <table style="width: 100%; background-color: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <tr>
            <td style="font-size: 13px; color: #475569; padding-bottom: 4px;">Subtotal:</td>
            <td style="font-size: 13px; color: #475569; text-align: right; padding-bottom: 4px;">৳${Math.round(subtotal).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #475569; padding-bottom: 4px;">Shipping Cost:</td>
            <td style="font-size: 13px; color: #475569; text-align: right; padding-bottom: 4px;">৳${Math.round(order.shippingCost).toLocaleString()}</td>
          </tr>
          ${
            order.discount > 0
              ? `
          <tr>
            <td style="font-size: 13px; color: #16a34a; padding-bottom: 4px;">Discount:</td>
            <td style="font-size: 13px; color: #16a34a; text-align: right; padding-bottom: 4px;">-৳${Math.round(order.discount).toLocaleString()}</td>
          </tr>
          `
              : ""
          }
          <tr style="border-top: 1px solid #cbd5e1;">
            <td style="font-size: 15px; font-weight: 700; color: #0f172a; padding-top: 6px;">Total Amount:</td>
            <td style="font-size: 15px; font-weight: 700; color: #d97706; text-align: right; padding-top: 6px;">৳${Math.round(grandTotal).toLocaleString()}</td>
          </tr>
        </table>

        <!-- Payment & Delivery Info -->
        <p style="font-size: 12px; color: #64748b; margin: 0;">
          <strong>Payment Method:</strong> ${order.orderPaymentMethod.replace(/_/g, " ")}<br />
          <strong>Delivery Address:</strong> ${order.fullAddress}
        </p>
      </div>
    `,
  });
}
