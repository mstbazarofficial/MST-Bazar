import { OrderTrackingHeader } from "@/components/main/user/order-track/OrderTrackingHeader";
import { OrderSummaryCard } from "@/components/main/user/order-track/OrderSummaryCard";
import { TrackingTimelineCard } from "@/components/main/user/order-track/TrackingTimelineCard";
import { OrderDetailsGrid } from "@/components/main/user/order-track/OrderDetailsGrid";

// ==========================================
// Types & Interfaces
// ==========================================
export interface TimelineStep {
  title: string;
  date: string;
  time: string;
  completed: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface OrderData {
  orderId: string;
  placedOnDate: string;
  placedOnTime: string;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  currentStatus: string;
  timeline: TimelineStep[];
  deliveryInfo: {
    recipientName: string;
    phone: string;
    address: string;
    deliveryMethod: string;
    courierService: string;
    trackingNumber: string;
  };
  items: OrderItem[];
  priceDetails: {
    subtotal: number;
    deliveryCharge: number;
    discount: number;
  };
}

export default function OrderTrackingPage() {
  // mock data
  const mockOrderData: OrderData = {
    orderId: "#MSTB-2024-00125",
    placedOnDate: "20 May 2024",
    placedOnTime: "10:30 AM",
    total: 1850,
    paymentStatus: "unpaid",
    paymentMethod: "COD",
    currentStatus: "delivered", // Possible values: "cancelled", "delivered", "in-progress", "pending", "shipped"
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
        completed: false,
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

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <OrderTrackingHeader />

        <OrderSummaryCard order={mockOrderData} />

        <TrackingTimelineCard
          steps={mockOrderData.timeline}
          isCancelled={mockOrderData.currentStatus === "cancelled"}
        />

        <OrderDetailsGrid
          deliveryInfo={mockOrderData.deliveryInfo}
          items={mockOrderData.items}
          priceDetails={mockOrderData.priceDetails}
          total={mockOrderData.total}
        />
      </div>
    </div>
  );
}
