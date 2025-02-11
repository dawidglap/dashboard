"use client";

import SupportForm from "@/components/Support/SupportForm";
import FaqSupport from "@/components/Support/FaqSupport";

const HelpPage = () => {
  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Support Form (Left) */}
      <div className="w-full lg:w-2/3">
        <SupportForm />
      </div>

      {/* FAQ Section (Right) */}
      <div className="w-full lg:w-1/3">
        <FaqSupport />
      </div>
    </div>
  );
};

export default HelpPage;
