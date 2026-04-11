"use client";

import Icon from "../../Common/Components/Atoms/Icon";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <section
      className="animate-fade-in-up"
      id="not-found"
      style={{ animationDelay: "0.1s" }}
    >
      <div className="grid lg:grid-cols-2 gap-0 bg-surface-variant/30 rounded-3xl overflow-hidden border border-indigo-100">
        <div className="p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
          <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-6 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-primary/30"></span>
            Error Code 404
          </span>
          <h2 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface mb-8 leading-[1.1]">
            Lost in the Library?
          </h2>
          <p className="text-lg text-on-surface-variant mb-12 leading-relaxed">
            The page you are looking for seems to have been misplaced or
            archived. Let's get you back on the right academic path.
          </p>
          <div className="mt-12 flex items-center gap-6 text-sm">
            <button
              className="text-primary font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
              onClick={() => router.push("/")}
            >
              <Icon name="arrow_back" className="!text-lg" />
              Go Back
            </button>
          </div>
        </div>
        <div className="bg-indigo-50 relative flex items-center justify-center p-12 overflow-hidden order-1 lg:order-2">
          <div className="absolute inset-0 opacity-40">
            <img
              alt="Library Pattern"
              className="w-full h-full object-cover grayscale opacity-20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZyAn7tCcnRJlI43VVHxmbHYc9gwzf35f1PRMPEw3RxDL9CM7A2NfNSZVXb6UyZs-7U93bkv5xy3qTtpLV_gzmEDTmOhI0QIUM13E2ZAYYEvkDxpKR1czD0g6ZRkeRKi_pw_XyGoYL9CfwH1b1n6Fzt7spMP-9cbQFkH41QfIyCYZuksM-_FcbMit-xNw3PnC0kMSbQP1Rk-JJFa_jR8Jzfy0zCtECL-p2pCIZN6VmqBz_MkZt_4f5H3YsdgAI4VPLoKRkkiFwvsk"
            />
          </div>
          <div className="relative">
            <span className="text-[14rem] font-black text-primary/10 select-none">
              404
            </span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform rotate-12 border border-indigo-50">
              <span
                className="material-symbols-outlined text-primary text-7xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                map
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
