"use client";

import { OrderData } from "@/app/(main)/user/order-track/[slug]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function OrderDetailsGrid({
  deliveryInfo,
  items,
  priceDetails,
  total,
}: {
  deliveryInfo: OrderData["deliveryInfo"];
  items: OrderData["items"];
  priceDetails: OrderData["priceDetails"];
  total: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(deliveryInfo.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Delivery Information */}
      <Card className="shadow-sm border-gray-100 rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900">
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="text-sm text-gray-500 mb-1">Recipient Name</p>
            <p className="font-semibold text-gray-900">
              {deliveryInfo.recipientName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone</p>
            <p className="font-semibold text-gray-900">{deliveryInfo.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
            <p className="font-semibold text-gray-900 leading-relaxed whitespace-pre-wrap">
              {deliveryInfo.address}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Delivery Method</p>
            <p className="font-semibold text-gray-900">
              {deliveryInfo.deliveryMethod}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Courier Service</p>
            <p className="font-semibold text-gray-900">
              {deliveryInfo.courierService}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {deliveryInfo.trackingNumber}
              </span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy Tracking Number"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Order Items */}
      <Card className="shadow-sm border-gray-100 rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900">
            Order Items ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Items List */}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-md p-1 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-gray-900 mb-1">
                      {item.name}
                    </h5>
                    <p className="text-gray-900 font-medium text-sm mb-0.5">
                      ৳{item.price.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs">Qty: {item.qty}</p>
                  </div>
                </div>
                <div className="font-semibold text-gray-900">
                  ৳{(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            {/* Price Calculation */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ৳{priceDetails.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-900">
                  ৳{priceDetails.deliveryCharge.toLocaleString()}
                </span>
              </div>
              {priceDetails.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-semibold">
                    -৳{priceDetails.discount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-base">Total</span>
              <span className="font-bold text-green-700 text-xl">
                ৳{total.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
