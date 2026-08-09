import { Button } from "@/components/ui/button";
import { ArrowLeft, Heading } from "lucide-react";
import HeadingStyle2 from "../../common/HeadingStyle2";

export function OrderTrackingHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <HeadingStyle2
          firstTitle="Order"
          secondTitle="Tracking"
          className="mb-5"
          position={5}
          isUnderLine={false}
        />
        <p className="text-sm text-gray-500">
          Track your order status in real-time
        </p>
      </div>
      <Button
        variant="outline"
        className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md font-semibold"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Orders
      </Button>
    </div>
  );
}
