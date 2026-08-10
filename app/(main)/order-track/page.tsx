"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Copy,
  Phone,
  Lock,
  Edit3,
  Package,
  Truck,
  Navigation,
  Check,
  Headset,
} from "lucide-react";
import HeadingStyle2 from "@/components/main/common/HeadingStyle2";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { OrderSummaryCard } from "@/components/main/user/order-track/OrderSummaryCard";
import { OrderData } from "../user/order-track/[slug]/page";
import { TrackingTimelineCard } from "@/components/main/user/order-track/TrackingTimelineCard";

// ==========================================
// Mock Data
// ==========================================
const mockOrderData: OrderData = {
  orderId: "#MSTB-2024-00125",
  placedOnDate: "20 May 2024",
  placedOnTime: "10:30 AM",
  total: 1850,
  paymentStatus: "unpaid",
  paymentMethod: "COD",
  currentStatus: "cancelled", // Possible values: "cancelled", "delivered", "in-progress", "pending", "shipped"
  timeline: [
    {
      title: "Order Confirmed",
      date: "20 May 2024",
      time: "10:30 AM",
      completed: true,
    },
    {
      title: "Processing",
      date: "20 May 2024",
      time: "02:15 PM",
      completed: true,
    },
    {
      title: "Shipped",
      date: "21 May 2024",
      time: "11:40 AM",
      completed: true,
    },
    {
      title: "Out for Delivery",
      date: "22 May 2024",
      time: "09:20 AM",
      completed: true,
    },
    {
      title: "Delivered",
      date: "22 May 2024",
      time: "02:35 PM",
      completed: true,
    },
  ],
  deliveryInfo: {
    recipientName: "MD. Taraque Rahman Fahim",
    phone: "+880 1772 606940",
    address:
      "House: 45, Road: 12, Sector: 10\nUttara, Dhaka - 1230\nBangladesh",
    deliveryMethod: "Standard Delivery",
    courierService: "Steadfast Courier",
    trackingNumber: "SDC123456789BD",
  },
  items: [
    {
      id: "item-1",
      name: "Miniket Rice 5kg",
      qty: 1,
      price: 450,
      image: "https://via.placeholder.com/60",
    },
    {
      id: "item-2",
      name: "Fresh Soybean Oil 2L",
      qty: 1,
      price: 320,
      image: "https://via.placeholder.com/60",
    },
    {
      id: "item-3",
      name: "Fresh Hand Towel Tissue (4 Pack)",
      qty: 1,
      price: 180,
      image: "https://via.placeholder.com/60",
    },
  ],
  priceDetails: {
    subtotal: 950,
    deliveryCharge: 80,
    discount: 180,
  },
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  // Handle Track Order functionality
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && phone) {
      // Simulate API call
      setIsTracking(true);
    } else {
      alert("Please enter both Order ID and Mobile Number.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ================= Header Section ================= */}
        <div className="text-center space-y-3">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1 rounded-full shadow-none font-medium">
            Order Tracking
          </Badge>
          <HeadingStyle2
            firstTitle="Track"
            secondTitle="Your Order"
            isUnderLine={false}
            titleAlignX="center"
          />
          <p className="text-gray-500 text-sm">
            Enter your Order ID and mobile number to track your order status
          </p>
        </div>

        {/* ================= Track Order Form Card ================= */}
        <Card className="shadow-sm border border-primary/55 rounded-md bg-white">
          <CardContent className="px-6 md:px-8">
            <form onSubmit={handleTrackOrder}>
              <FieldSet className="space-y-6">
                <FieldLegend className="sr-only">
                  Track Your Order Details
                </FieldLegend>

                <FieldGroup className="flex flex-col md:flex-row items-end gap-4">
                  <Field className="w-full space-y-2">
                    <FieldLabel className="text-sm font-medium text-gray-700">
                      Order ID
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter your order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="pl-4 pr-10 h-12 border-gray-200 focus-visible:ring-primary/70 rounded-sm"
                      />
                      <Copy className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </Field>

                  <Field className="w-full space-y-2">
                    <FieldLabel className="text-sm font-medium text-gray-700">
                      Mobile Number
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-4 pr-10 h-12 border-gray-200 focus-visible:ring-primary/70 rounded-sm"
                      />
                      <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </Field>

                  <Button
                    type="submit"
                    className="w-full md:w-auto h-12 px-8 bg-[#0a5c2f] hover:bg-[#084b25] text-white rounded-lg font-semibold flex items-center justify-center shrink-0 mb-7 md:mb-0"
                  >
                    Track Order <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </FieldGroup>
              </FieldSet>
            </form>

            <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <p>Your information is safe and secure with us</p>
            </div>
          </CardContent>
        </Card>

        {/* ================= Tracking Result Section ================= */}
        {isTracking && (
          <Card className="shadow-sm border-primary/55 rounded-md bg-white animate-in fade-in slide-in-from-bottom-4 duration-500 py-0 border">
            <CardContent className="p-0 gap-0">
              {/* Top Summary Row */}
              <OrderSummaryCard
                className=" shadow-none border-none mb-0 rounded-none"
                order={mockOrderData}
              />
              {/* Timeline Section */}
              <TrackingTimelineCard
                className=" shadow-none border-none mb-0 rounded-none"
                steps={mockOrderData.timeline}
                isCancelled={mockOrderData.currentStatus === "cancelled"}
              />

              {/* Order Items & Billing Section */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
                  {/* Left: Order Items */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-5">
                      Order Items ({mockOrderData.items.length})
                    </h3>
                    <div className="space-y-6">
                      {mockOrderData.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-md p-1.5 shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">
                                {item.name}
                              </h5>
                              <p className="text-gray-500 text-xs">
                                Qty: {item.qty}
                              </p>
                            </div>
                          </div>
                          <div className="font-semibold text-sm text-gray-900 whitespace-nowrap">
                            {item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Billing Breakdown */}
                  <div className="lg:border-l border-primary/55 lg:pl-12 flex flex-col justify-end pt-6 lg:pt-0 border-t lg:border-t-0">
                    <div className="space-y-4 text-sm w-full">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-semibold text-gray-900">
                          {mockOrderData.priceDetails.subtotal}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Delivery Charge</span>
                        <span className="font-semibold text-gray-900">
                          {mockOrderData.priceDetails.deliveryCharge}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">
                          {mockOrderData.priceDetails.discount}
                        </span>
                      </div>

                      <Separator className="my-2 bg-primary/55" />

                      <div className="flex justify-between items-center pt-1">
                        <span className="font-bold text-gray-900 text-base">
                          Total
                        </span>
                        <span className="font-bold text-green-700 text-xl">
                          {mockOrderData.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= Need Help Footer Card ================= */}
        <Card className="shadow-sm border border-primary/55 bg-primary/5 rounded-md">
          <CardContent className="px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
              <div className="w-12 h-12 rounded-full bg-primary-dark/15 flex items-center justify-center shrink-0">
                <Headset className="w-6 h-6 text-primary-dark" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">
                  Need Help?
                </h4>
                <p className="text-gray-600 text-sm">
                  If you have any questions about your order, feel free to
                  contact our support team.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-primary-dark text-primary-dark hover:bg-green-100 font-semibold rounded-lg h-11 px-6 shrink-0"
            >
              Contact Support <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
