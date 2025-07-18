"use client";

import SupportForm from "@/components/Support/SupportForm";
import FaqSupport from "@/components/Support/FaqSupport";

const HelpPage = () => {
  return (
    <div className="px-4 lg:px-4 xl:px-6 2xl:px-12">
      <h1 className="text-xl sm:text-2xl md:text-4xl text-center md:text-start mt-8 mb-8 font-extrabold text-base-content">
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
