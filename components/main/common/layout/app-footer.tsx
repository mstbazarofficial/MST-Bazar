import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-primary-dark border-t border-border text-white pt-12 ">
      <div className="site-container section-y ">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Column 1: Brand Info & Socials */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1 lg:col-span-1">
            {/* Brand Logo */}

            {/* Description */}
            <p className="text-xs text-primary-foreground font-medium leading-relaxed max-w-xs">
              Your trusted online grocery store in Bangladesh. Fresh, natural
              and healthy products delivered to your doorstep.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1 ">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-primary/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-primary/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-primary/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-primary/60 hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-primary-foreground tracking-tight">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs font-medium text-primary-foreground">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/return-refund"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="hover:text-primary-yellow transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-primary-foreground tracking-tight">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-medium text-primary-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-yellow transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links (Replaces "Our App") */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-primary-foreground tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium text-primary-foreground">
              <li>
                <Link
                  href="#best-deals"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Best Deals
                </Link>
              </li>
              <li>
                <Link
                  href="#featured"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Popular Products
                </Link>
              </li>
              <li>
                <Link
                  href="#flash-sale"
                  className="hover:text-primary-yellow transition-colors"
                >
                  Flash Sale
                </Link>
              </li>
              <li>
                <Link
                  href="#new-arrivals"
                  className="hover:text-primary-yellow transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary-yellow transition-colors"
                >
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Payment Methods */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="text-sm font-extrabold text-primary-foreground tracking-tight">
              Payment Methods
            </h4>

            {/* Grid of Payment Badges */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2 pt-1">
              <div className="h-9 rounded-md border border-border bg-background flex items-center justify-center p-1 shadow-2xs hover:border-primary/40 transition-colors">
                <span className="text-[11px] font-black text-[#E2136E]">
                  bKash
                </span>
              </div>
              <div className="h-9 rounded-md border border-border/80 bg-background flex items-center justify-center p-1 shadow-2xs hover:border-primary/40 transition-colors">
                <span className="text-[11px] font-black text-[#F7921E]">
                  নগদ
                </span>
              </div>
              <div className="h-9 rounded-md border border-border/80 bg-background flex items-center justify-center p-1 shadow-2xs hover:border-primary/40 transition-colors">
                <span className="text-[10px] font-black text-[#8C3494]">
                  Rocket
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Links */}
      </div>
      <div className="bg-primary-dark site-container py-5 border-t border-border/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-primary-foreground section-container">
          <p>© 2026 MST Bazar. All Rights Reserved.</p>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/privacy"
              className="hover:text-primary-yellow transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/terms"
              className="hover:text-primary-yellow transition-colors"
            >
              Terms & Conditions
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/refund-policy"
              className="hover:text-primary-yellow transition-colors"
            >
              Refund Policy
            </Link>
          </div>
          <div>
            Design & Development By{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://webngraphic.com"
              className="font-bold  text-amber-300 hover:text-blue-800 transition-colors underline"
            >
              WebNGraphic
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
