import Image from "next/image";

export function AuthBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Image
        src="/assets/resistation-banner.webp"
        alt="Auth Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom"
      />
    </div>
  );
}
