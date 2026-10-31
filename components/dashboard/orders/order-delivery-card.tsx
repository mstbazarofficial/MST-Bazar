import { Panel } from "@/components/dashboard/layout/dashboard-panel";

interface OrderDeliveryCardProps {
  customerName: string;
  phoneNumber: string;
  whatsappNumber?: string | null;
  fullAddress: string;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-foreground">{value}</dd>
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
    <Panel title="Delivery details">
      <dl className="space-y-3 px-5 pb-5 text-sm">
        <Row label="Recipient" value={customerName} />
        <Row label="Phone" value={phoneNumber} />
        {whatsappNumber && <Row label="WhatsApp" value={whatsappNumber} />}
        <Row label="Address" value={fullAddress} />
      </dl>
    </Panel>
  );
}
