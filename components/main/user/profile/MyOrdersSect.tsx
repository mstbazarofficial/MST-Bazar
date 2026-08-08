import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import HeadingStyle2 from "../../common/HeadingStyle2";

export function MyOrdersSection() {
  const orders = [
    {
      id: "#MSTB-2024-00125",
      date: "20 May 2024",
      items: 3,
      total: "৳1,850",
      status: "Delivered",
      statusColor: "bg-green-50 text-green-700 border-green-200",
    },
    {
      id: "#MSTB-2024-00110",
      date: "10 May 2024",
      items: 2,
      total: "৳950",
      status: "Shipped",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "#MSTB-2024-00098",
      date: "02 May 2024",
      items: 4,
      total: "৳2,450",
      status: "Processing",
      statusColor: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      id: "#MSTB-2024-00075",
      date: "25 Apr 2024",
      items: 1,
      total: "৳650",
      status: "Delivered",
      statusColor: "bg-green-50 text-green-700 border-green-200",
    },
  ];

  return (
    <section className="mb-8 mt-14">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        <HeadingStyle2
          firstTitle="My"
          secondTitle="Orders"
          isUnderLine={false}
          className="mb-5"
          position={2}
        />
        <a
          href="#"
          className="text-green-700 font-semibold text-sm flex items-center hover:underline"
        >
          View All Orders <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
      <Card className="shadow-sm border px border-gray-100 rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {order.id}
                </TableCell>
                <TableCell className="text-gray-600">{order.date}</TableCell>
                <TableCell className="text-gray-600 flex items-center gap-2">
                  {/* Mocking item images */}
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded bg-gray-200 border border-white"></div>
                    <div className="w-8 h-8 rounded bg-gray-300 border border-white"></div>
                    {order.items > 2 && (
                      <div className="w-8 h-8 rounded bg-gray-400 border border-white"></div>
                    )}
                  </div>
                  <span className="ml-2">
                    {order.items} {order.items > 1 ? "Items" : "Item"}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {order.total}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${order.statusColor} font-medium`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a
                    href="#"
                    className="text-green-700 font-semibold hover:underline"
                  >
                    View Details
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
}
