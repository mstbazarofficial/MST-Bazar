import Image from "next/image";

export function AuthBg() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none aspect-video">
      <Image
        src="/assets/resistation-banner.webp"
        alt="Auth Background"
        fill
        sizes="100vw"
        loading="eager"
        className="object-cover object-bottom bg-fixed"
      />
    </div>
  );
}
