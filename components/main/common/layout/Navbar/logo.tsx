import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  src?: string;
  alt?: string;
  size?: number;
}

// Drop your real logo path in via `src`, e.g. <Logo src="/logo.svg" />.
// Using a fixed height + auto width so any logo aspect ratio stays sharp.
export function Logo({
  href = "/",
  src = "/assets/logo.png",
  alt = "Logo",
  size = 48,
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
        width={size}
        height={size}
        priority
        className=" w-auto"
      />
    </Link>
  );
}
