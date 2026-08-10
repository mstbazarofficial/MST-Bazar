"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Headset,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  RotateCcw,
  CreditCard,
  Banknote,
} from "lucide-react";
import HeadingStyle2 from "@/components/main/common/HeadingStyle2";
import Link from "next/link";

// ==========================================
// Types & Mock Data
// ==========================================
type OrderStatus =
  | "Delivered"
  | "Shipped"
  | "Processing"
  | "Cancelled"
  | "Returned";

interface Order {
  id: string;
  date: string;
  time: string;
  images: string[];
  totalItems: number;
  amount: string;
  paymentMethod: "bKash" | "Nagad" | "Credit Card" | "Cash on Delivery";
  status: OrderStatus;
}

const mockOrders: Order[] = [
  {
    id: "#MSTB-2024-00125",
    date: "20 May 2024",
    time: "10:30 AM",
    images: [
      "https://via.placeholder.com/40/f8f9fa/000000?text=Oil",
      "https://via.placeholder.com/40/f8f9fa/000000?text=Rice",
      "https://via.placeholder.com/40/f8f9fa/000000?text=Tissue",
    ],
    totalItems: 3,
    amount: "৳1,850",
    paymentMethod: "bKash",
    status: "Delivered",
  },
  {
    id: "#MSTB-2024-00110",
    date: "10 May 2024",
    time: "09:15 AM",
    images: [
      "https://via.placeholder.com/40/f8f9fa/000000?text=Rice",
      "https://via.placeholder.com/40/f8f9fa/000000?text=Ghee",
    ],
    totalItems: 2,
    amount: "৳950",
    paymentMethod: "Nagad",
    status: "Shipped",
  },
  {
    id: "#MSTB-2024-00098",
    date: "02 May 2024",
    time: "11:20 AM",
    images: [
      "https://via.placeholder.com/40/f8f9fa/000000?text=Tea",
      "https://via.placeholder.com/40/f8f9fa/000000?text=Tissue",
      "https://via.placeholder.com/40/f8f9fa/000000?text=Ghee",
    ],
    totalItems: 4,
    amount: "৳2,450",
    paymentMethod: "Credit Card",
    status: "Processing",
  },
  {
    id: "#MSTB-2024-00075",
    date: "25 Apr 2024",
    time: "02:40 PM",
    images: ["https://via.placeholder.com/40/f8f9fa/000000?text=Rice"],
    totalItems: 2,
    amount: "৳650",
    paymentMethod: "bKash",
    status: "Delivered",
  },
  {
    id: "#MSTB-2024-00045",
    date: "18 Apr 2024",
    time: "10:05 AM",
    images: [
      "https://via.placeholder.com/40/f8f9fa/000000?text=Oil",
      "https://via.placeholder.com/40/f8f9fa/000000?text=Rice",
    ],
    totalItems: 5,
    amount: "৳3,120",
    paymentMethod: "Nagad",
    status: "Delivered",
  },
  {
    id: "#MSTB-2024-00030",
    date: "12 Apr 2024",
    time: "04:20 PM",
    images: ["https://via.placeholder.com/40/f8f9fa/000000?text=Ghee"],
    totalItems: 2,
    amount: "৳980",
    paymentMethod: "Cash on Delivery",
    status: "Cancelled",
  },
  {
    id: "#MSTB-2024-00012",
    date: "05 Apr 2024",
    time: "09:30 AM",
    images: [
      "https://via.placeholder.com/40/f8f9fa/000000?text=Tissue",
      "https://via.placeholder.com/40/f8f9fa/000000?text=Oil",
    ],
    totalItems: 4,
    amount: "৳1,760",
    paymentMethod: "Credit Card",
    status: "Returned",
  },
];

const tabs = [
  "All Orders",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

// ==========================================
// Helper Components
// ==========================================

// Payment Method Icon Renderer
const PaymentIcon = ({ method }: { method: Order["paymentMethod"] }) => {
  if (method === "bKash") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#e2136e">
        <path d="M12 2L3 8v8l9 6 9-6V8l-9-6zm0 2.5l6 4v5l-6 4-6-4v-5l6-4z" />
      </svg>
    );
  }
  if (method === "Nagad") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#F76B2A">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6H7l5-5 5 5h-2v6z" />
      </svg>
    );
  }
  if (method === "Credit Card") {
    return <CreditCard className="w-5 h-5 text-gray-700" />;
  }
  return <Banknote className="w-5 h-5 text-gray-700" />;
};

// Status Badge Renderer
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  let styles = "";
  let Icon = CheckCircle2;

  switch (status) {
    case "Delivered":
      styles = "bg-green-50 text-green-700 border-green-200";
      Icon = CheckCircle2;
      break;
    case "Shipped":
      styles = "bg-blue-50 text-blue-700 border-blue-200";
      Icon = Truck;
      break;
    case "Processing":
      styles = "bg-orange-50 text-orange-700 border-orange-200";
      Icon = Clock;
      break;
    case "Cancelled":
      styles = "bg-red-50 text-red-700 border-red-200";
      Icon = XCircle;
      break;
    case "Returned":
      styles = "bg-purple-50 text-purple-700 border-purple-200";
      Icon = RotateCcw;
      break;
  }

  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-1 text-xs font-medium flex w-fit items-center gap-1.5 shadow-none ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </Badge>
  );
};

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [filterTime, setFilterTime] = useState("All Time");

  // Filtering Logic
  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === "All Orders") return true;
    return order.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8">
      <div className="max-w-300 mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <HeadingStyle2
              firstTitle="my"
              secondTitle="Orders"
              size="md"
              titleAlignX="left"
              isUnderLine={false}
            />

            <p className="text-sm text-gray-500">
              View and track all your orders in one place
            </p>
          </div>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md font-semibold"
          >
            <Headset className="w-4 h-4 mr-2" /> Need Help?
          </Button>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden bg-white">
          {/* Tabs and Filter Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 px-6 pt-2 gap-4">
            {/* Scrollable Tabs for Mobile */}
            <div className="flex gap-6 overflow-x-auto w-full hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                    activeTab === tab
                      ? "text-green-700"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-green-700 rounded-t-md" />
                  )}
                </button>
              ))}
            </div>

            {/* Time Filter Select */}
            <div className="pb-4 sm:pb-0 sm:mb-2 min-w-30">
              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700"
              >
                <option value="All Time">All Time</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>

          <CardContent className="p-0">
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
              <Table className="w-full min-w-225">
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="border-gray-100 hover:bg-transparent">
                    <TableHead className="py-4 px-6 font-semibold text-gray-700">
                      Order ID
                    </TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-700">
                      Date
                    </TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-700">
                      Items
                    </TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-700">
                      Total Amount
                    </TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-700">
                      Payment Method
                    </TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-700">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Order ID */}
                        <TableCell className="px-6 py-4">
                          <span className="font-bold text-green-700 text-sm">
                            {order.id}
                          </span>
                        </TableCell>

                        {/* Date & Time */}
                        <TableCell className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {order.date}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.time}
                          </p>
                        </TableCell>

                        {/* Items Images & Count */}
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {order.images.slice(0, 2).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="Product"
                                  className="w-9 h-9 rounded-md border-2 border-white bg-gray-50 object-cover shadow-sm z-10"
                                />
                              ))}
                              {order.totalItems > 2 && (
                                <div className="w-9 h-9 rounded-md border-2 border-white bg-green-50 text-green-700 flex items-center justify-center text-xs font-bold shadow-sm z-20">
                                  +{order.totalItems - 2}
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                              {order.totalItems} Items
                            </span>
                          </div>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="px-6 py-4 font-bold text-gray-900 text-base">
                          {order.amount}
                        </TableCell>

                        {/* Payment Method */}
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <PaymentIcon method={order.paymentMethod} />
                            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </TableCell>

                        {/* Action */}
                        <TableCell className="px-6 py-4">
                          <Link
                            href={`/user/order-track/inv${order.id}`}
                            className="flex items-center text-green-700 font-bold text-sm hover:underline whitespace-nowrap group"
                          >
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-32 text-center text-gray-500"
                      >
                        No orders found in this category.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Footer */}
            <div className="border-t border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing 1 to {filteredOrders.length} of {filteredOrders.length}{" "}
                orders
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded border-gray-200"
                  disabled
                >
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="w-8 h-8 rounded bg-green-700 text-white hover:bg-green-800"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded border-gray-200 text-gray-400"
                  disabled
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Style for hiding scrollbar in tabs */}
    </div>
  );
}
