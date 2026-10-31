import { Panel } from "@/components/dashboard/layout/dashboard-panel";
import { SITE_CONFIG } from "@/constants/site";
import { MessageCircle, Phone } from "lucide-react";

export function OrderHelpCard() {
  return (
    <Panel title="Need help?" description="We're available 9 AM – 9 PM every day.">
      <div className="divide-y divide-border border-t border-border">
        <a
          href={`tel:${SITE_CONFIG.phone}`}
          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
        >
          <Phone className="size-4 shrink-0 text-muted-foreground" />
          Call {SITE_CONFIG.phone}
        </a>
        <a
          href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
        >
          <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
          Message on WhatsApp
        </a>
      </div>
    </Panel>
  );
}
