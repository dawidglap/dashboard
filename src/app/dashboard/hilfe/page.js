"use client";

import SupportForm from "@/components/Support/SupportForm";
import FaqSupport from "@/components/Support/FaqSupport";

const HelpPage = () => {
  return (
    <div className="px-4 md:px-12">
      <h1 className="text-3xl mt-8 md:text-4xl font-extrabold text-base-content mb-6">
        Kontakt Support
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Support Form (Left) */}

        <div className="w-full lg:w-2/3">
          <SupportForm />
        </div>

        {/* FAQ Section (Right) */}
        <div className="w-full lg:w-1/3">
          <FaqSupport />
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

// comment
