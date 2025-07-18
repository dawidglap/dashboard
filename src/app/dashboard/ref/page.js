import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ReferralTable from "@/components/ReferralTable";
import ReferralLeaderboard from "@/components/ReferralLeaderboard";

export default async function ReferralPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="px-4 lg:px-4 xl:px-6 2xl:px-12">
        
    <h1 className="text-2xl mt-6 mb-4 sm:text-2xl md:text-3xl lg:text-4xl text-center lg:text-left font-extrabold text-base-content dark:text-white">
        Referral Übersicht
   </h1>
   <div className="flex flex-col lg:flex-row gap-6">
  <div className="w-full lg:w-2/3">
    <ReferralTable />
  </div>
  <div className="w-full lg:w-1/3 ">
    <ReferralLeaderboard />
  </div>
</div>
    </div>
  );
}
