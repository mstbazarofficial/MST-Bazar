import { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import { z } from "zod";

// 1. Order Item Schema (Includes optional productId for catalog linking)
export const orderItemSchema = z.object({
  productId: z.string().nullable().optional(), // ID of selected catalog product (if linked)
  productName: z.string().min(1, "Product name is required"),
  productImage: z.string().nullable().optional(),
  quantity: z
    .number("Quantity is required")
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  price: z.number("Price is required").min(0, "Price cannot be negative"),
  discountPercentage: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .default(0),
});

export type OrderItemInput = z.input<typeof orderItemSchema>;

// 2. Base Order Schema
const orderBaseSchema = z.object({
  userId: z.string().optional(), // Optional link to a registered user account

  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name must be less than 100 characters"),

  emailAddress: z.email("Invalid email address"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number is too long"),

  whatsappNumber: z.string().optional(),

  fullAddress: z
    .string()
    .min(1, "Full address is required")
    .max(500, "Address is too long"),

  status: z
    .enum(OrderStatus, { message: "Invalid order status" })
    .default(OrderStatus.PENDING),

  orderPaymentMethod: z
    .enum(PaymentMethod, { message: "Invalid payment method" })
    .default(PaymentMethod.CASH_ON_DELIVERY),

  TrxNumber: z.string().optional(),
  TrxID: z.string().optional(),

  shippingCost: z.number().min(0, "Shipping cost cannot be negative"),

  discount: z.number().min(0, "Discount cannot be negative"),

  orderItems: z.array(orderItemSchema),
});

// 3. Create Order Schema
export const createOrderSchema = orderBaseSchema.refine(
  (data) => data.orderItems.length > 0,
  {
    message: "At least one product item is required",
    path: ["orderItems"],
  },
);

export type CreateOrderInput = z.input<typeof createOrderSchema>;

export const orderCostSchema = z.object({
  productCost: z.number().min(0, "Product cost cannot be negative"),
  transportCost: z.number().min(0, "Discount cannot be negative"),
});
export type OrderCostFormData = z.infer<typeof orderCostSchema>;

export const editOrderInfoSchema = z.object({
  userId: z.string().nullable().optional(),
  customerName: z.string().min(1, "Customer name is required"),
  emailAddress: z.email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  whatsappNumber: z.string().nullable().optional(),
  fullAddress: z.string().min(1, "Shipping address is required"),
  orderPaymentMethod: z.enum(PaymentMethod, {
    message: "Invalid payment method",
  }),
  TrxNumber: z.string().nullable().optional(),
  TrxID: z.string().nullable().optional(),
});

export type EditOrderInfoInput = z.infer<typeof editOrderInfoSchema>;

export const editOrderSummarySchema = z.object({
  shippingCost: z.number().min(0, "Shipping cost cannot be negative"),
  discount: z.number().min(0, "Discount cannot be negative"),
});

export type EditOrderSummaryInput = z.input<typeof editOrderSummarySchema>;

export const editOrderCostsSchema = z.object({
  productCost: z
    .number()
    .min(0, "Product cost cannot be negative")
    .nullable()
    .optional(),
  deliveryCost: z
    .number()
    .min(0, "Delivery cost cannot be negative")
    .nullable()
    .optional(),
});

export type EditOrderCostsInput = z.input<typeof editOrderCostsSchema>;

export const editOrderStatusSchema = z.object({
  status: z.enum(OrderStatus, { message: "Invalid order status" }),
});

export type EditOrderStatusInput = z.infer<typeof editOrderStatusSchema>;
