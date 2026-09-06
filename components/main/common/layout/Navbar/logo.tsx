import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  src?: string;
  alt?: string;
  className?: string;
}

export function Logo({
  href = "/",
  src = "/assets/Mst-Bazar-Nav-Logo.png",
  alt = "Logo",
  className = "",
}: LogoProps) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center"
      aria-label="Go to homepage"
    >
      <Image
        src={src}
        alt={alt}
        width={230}
        height={58}
        preload={true}
        quality={60}
        className={` object-contain ${className}`}
      />
    </Link>
  );
}
