import { ArrowLeft, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CheckoutHeader() {
  return (
    <header className="border-b bg-background">
      <div className="site-container flex h-14 items-center justify-between gap-4">
        <Link
          href="/products"
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Shop</span>
        </Link>

        <Link href="/" aria-label="MST Bazar home">
          <Image
            src="/assets/logo-vertical.png"
            alt="MST Bazar"
            width={155}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          <span>Checkout</span>
        </span>
      </div>
    </header>
  );
}
