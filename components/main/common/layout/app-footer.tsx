import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  // Contact Information from Environment Variables
  const contactNumber = process.env.NEXT_PUBLIC_CONTACT_NUMBER;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const contactAddress = process.env.NEXT_PUBLIC_CONTACT_ADDRESS;
  const contactWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  // Social Media URLs
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_URL;

  return (
    <footer className="w-full bg-[#123B2A] border-t border-border text-white pt-6">
      <div className="site-container section-y pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Column 1: Brand Info & Socials */}
          <div className="space-y-4">
            {/* Brand Logo */}
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logo-vertical.png"
                alt="MST Bazar Logo"
                width={150}
                height={50}
                quality={60}
                className="h-auto w-auto max-h-10 object-contain"
              />
            </Link>

            {/* Description */}
            <p className="text-xs text-white/80 font-medium leading-relaxed max-w-xs">
              Your trusted online grocery store in Bangladesh. Fresh, natural,
              and healthy products delivered to your doorstep.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`${facebookUrl}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 hover:text-amber-300 flex items-center justify-center text-white transition-all"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </Link>
              <Link
                href={`${instagramUrl}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 hover:text-amber-300 flex items-center justify-center text-white transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </Link>
              <Link
                href={`${youtubeUrl}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 hover:text-amber-300 flex items-center justify-center text-white transition-all"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              <li>
                <Link
                  href="/"
                  className="hover:text-amber-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-amber-300 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/best-deals"
                  className="hover:text-amber-300 transition-colors"
                >
                  Best Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/products/popular-products"
                  className="hover:text-amber-300 transition-colors"
                >
                  Popular Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/combo-deals"
                  className="hover:text-amber-300 transition-colors"
                >
                  Combo Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-amber-300 transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/return-refund"
                  className="hover:text-amber-300 transition-colors"
                >
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-amber-300 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-amber-300 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              Company
            </h3>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              <li>
                <Link
                  href="/about"
                  prefetch={false}
                  className="hover:text-amber-300 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-amber-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-amber-300 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Address */}
          <div className="space-y-3 col-span-full md:col-span-1 lg:col-span-1 justify-self-center md:justify-self-start">
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              Contact Information
            </h3>
            <address className="not-italic space-y-2 text-xs font-medium text-white/80">
              <p>{contactAddress}</p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:${contactNumber}`}
                  className="hover:text-amber-300 transition-colors"
                >
                  {contactNumber}
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-amber-300 transition-colors"
                >
                  {contactEmail}
                </a>
              </p>
              <p>
                <a
                  href={`https://wa.me/${contactWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-[#0F2E1F] py-4 border-t border-white/10">
        <div className="site-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-white/70">
          <p>© MST Bazar. All Rights Reserved.</p>

          <div className="flex items-center gap-1">
            <span>Designed & Developed by</span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://webngraphic.com"
              className="font-semibold text-amber-300 hover:text-white transition-colors hover:underline"
            >
              WebNGraphic
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
