import ProfileInformationSection from "@/components/main/user/profile/ProfileInfoSect";
import { DeliveryAddressesSection } from "@/components/main/user/profile/DeliveryAddressSect";
import { MyOrdersSection } from "@/components/main/user/profile/MyOrdersSect";
import { RecentlyPurchasedSection } from "@/components/main/user/profile/RecentPurchasSect";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background/70 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <ProfileInformationSection />
        <DeliveryAddressesSection />
        <MyOrdersSection />
        <RecentlyPurchasedSection />
      </div>
    </div>
  );
}
