import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CreditCard,
  Package,
  RefreshCcw,
  User,
} from "lucide-react";
import HeadingStyle2 from "../common/HeadingStyle2";
import Link from "next/link";

export function FAQSection() {
  const faqs = [
    {
      icon: Package,
      title: "Order & Delivery",
      desc: "Find answers about order tracking, delivery time and shipping.",
    },
    {
      icon: CreditCard,
      title: "Payment & Offers",
      desc: "Learn about payment methods, discounts and special offers.",
    },
    {
      icon: RefreshCcw,
      title: "Returns & Refunds",
      desc: "Everything you need to know about returns and refund policies.",
    },
    {
      icon: User,
      title: "Account & Others",
      desc: "Get help with your account, privacy, and other common questions.",
    },
  ];

  return (
    <div className="mt-20">
      <HeadingStyle2
        firstTitle="Frequently"
        secondTitle="Asked Questions"
        size="md"
        link="/#faq"
        className="pb-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {faqs.map((faq, idx) => (
          <Card
            key={idx}
            className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-md hover:scale-[1.01] duration-300 ease-in-out"
          >
            <CardContent className="px-6">
              <faq.icon className="w-8 h-8 text-green-700 mb-5" />
              <h4 className="font-bold text-gray-900 text-lg mb-2">
                {faq.title}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 min-h-15">
                {faq.desc}
              </p>
              <Link
                href="/#faq"
                className="text-green-700 font-semibold text-sm flex items-center hover:underline"
              >
                View FAQs <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
