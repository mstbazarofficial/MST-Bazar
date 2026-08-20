import { MessageCircle, Phone } from "lucide-react";

const SUPPORT_PHONE = "+880 1XXX-XXXXXX"; // ← replace with your number

export function OrderHelpCard() {
  const tel = SUPPORT_PHONE.replace(/\s|-/g, "");

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <h2 className="text-sm font-bold text-foreground">Need Help?</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Our support team is available 9 AM – 9 PM every day.
        </p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        <a
          href={`tel:${tel}`}
          className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors group"
        >
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">Call us</p>
            <p className="text-sm font-bold text-primary">{SUPPORT_PHONE}</p>
          </div>
        </a>

        <a
          href={`https://wa.me/${tel.replace("+", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-emerald-400/50 hover:bg-emerald-50/50 transition-colors group"
        >
          <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-100/80 transition-colors">
            <MessageCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">WhatsApp us</p>
            <p className="text-sm font-bold text-emerald-600">
              {SUPPORT_PHONE}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
