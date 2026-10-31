import { CheckoutHeader } from "@/components/main/checkout/checkout-header";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CheckoutHeader />
      {children}
    </>
  );
}
