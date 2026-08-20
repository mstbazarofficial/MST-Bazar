import { MapPin, Phone, User } from "lucide-react";

interface OrderDeliveryCardProps {
  customerName: string;
  phoneNumber: string;
  whatsappNumber?: string | null;
  fullAddress: string;
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/60 last:border-0">
      <div className="h-7 w-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground wrap-break-word">
          {value}
        </span>
      </div>
    </div>
  );
}

export function OrderDeliveryCard({
  customerName,
  phoneNumber,
  whatsappNumber,
  fullAddress,
}: OrderDeliveryCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <h2 className="text-sm font-bold text-foreground">Delivery Details</h2>
      </div>
      <div className="px-5 py-1">
        <Row icon={User} label="Recipient" value={customerName} />
        <Row icon={Phone} label="Phone" value={phoneNumber} />
        {whatsappNumber && (
          <Row icon={Phone} label="WhatsApp" value={whatsappNumber} />
        )}
        <Row icon={MapPin} label="Address" value={fullAddress} />
      </div>
    </div>
  );
}
