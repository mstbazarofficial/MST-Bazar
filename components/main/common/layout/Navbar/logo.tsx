import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  src?: string;
  alt?: string;
}

export function Logo({
  href = "/",
  src = "/assets/logo-vertical.png",
  alt = "Logo",
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
        width={120}
        height={48}
        preload={true}
        quality={60}
        className=" w-auto h-6 sm:h-8 object-contain"
      />
    </Link>
  );
}
