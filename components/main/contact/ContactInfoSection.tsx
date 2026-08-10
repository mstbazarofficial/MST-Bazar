import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import HeadingStyle2 from "../common/HeadingStyle2";

export function ContactInfoSection() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      details: "+880 1234 56789",
      sub: "(10 AM - 8 PM, Sat - Thu)",
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@mstbazar.com",
      sub: "We reply within 24 hours",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: "+880 1234 56789",
      sub: "(10 AM - 8 PM, Sat - Thu)",
    },
    {
      icon: MapPin,
      title: "Our Location",
      details: "House 12, Road 5, Dhanmondi",
      sub: "Dhaka - 1205, Bangladesh",
    },
  ];

  return (
    <div className="flex flex-col space-y-8 h-full">
      <div>
        <HeadingStyle2
          firstTitle="Get in"
          secondTitle="Touch"
          className="mb-5"
        />
        <p className="text-gray-600 text-sm leading-relaxed">
          We value your feedback and are here to assist you with any inquiries,
          issues, or suggestions. Reach out to us through any of the following
          methods.
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {contactMethods.map((method, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 bg-gray-100 border border-gray-100 p-4 rounded-md"
          >
            <div className="w-12 h-12 rounded-sm bg-primary-dark flex items-center justify-center shrink-0 shadow-sm">
              <method.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">
                {method.title}
              </p>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {method.details}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{method.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-primary/45">
        <span className="font-bold text-gray-900">Follow Us</span>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark hover:bg-primary-dark hover:text-white transition-colors">
            <FaFacebook className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark hover:bg-primary-dark hover:text-white transition-colors">
            <FaInstagram className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark hover:bg-primary-dark hover:text-white transition-colors">
            <FaYoutube className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark hover:bg-primary-dark hover:text-white transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
