type Props = {
  activeStep: string | null;
  onNextStep: () => void;
  children: React.ReactNode;
};

export default function QuestionerLayout({
  activeStep,
  onNextStep,
  children,
}: Props) {
  return (
    <div className="flex-1 w-full flex flex-col md:flex-row">
      {/* LEFT */}
      <section className="w-full md:w-[40%] bg-surface flex flex-col p-12 md:p-20 top-20 h-fit lg:h-[calc(100vh-5rem)]">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/30 text-primary rounded-full mb-8">
            {/* ICON tetap */}
            <span
              className="text-xs font-bold tracking-widest uppercase cursor-pointer"
              onClick={onNextStep}
            >
              {activeStep === "admin"
                ? "Student Insights (Admin)"
                : activeStep === "fakultas"
                ? "Student Insights (Fakultas)"
                : "Student Insights (Prodi)"}
            </span>
          </div>

          <h1 className="text-[clamp(1rem,1rem+5vw,3.75rem)] font-headline font-extrabold text-on-surface leading-[1.1] mb-6 tracking-tight">
            Unpak Simonev
          </h1>

          <p className="!text-[clamp(0.7rem,0.7rem+5vw,1.3rem)] text-on-surface-variant leading-relaxed mb-12 font-body font-medium">
            Your feedback shapes the future of our campus.
          </p>

          <div className="relative mt-auto">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl z-10 relative bento-card">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy1duaPAB1nj9_p4kNbdKyG6FmnId6sfU1KcDaedVCQqTgV5U4O27uFmPhmq7W1r7GFSj815EPAtJV3PgMDUqc-qs_7sMoZRbz993cdoDpmo-urZLzzP47YIhDxuiFXcPKKRPe0TnteUmp5HQ6v9Vjzm4i2RxpiYyDWAQ9lTc-baF-mWAcCKpMEh6t7U-3yn8yzF0009789r2OvE1JQv83HJjPibY1M8kTMBdQofU4P3HJsJm5G5Ly3OBP0-yQX8k2LSSsEoVMlq4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT */}
      <section className="w-full md:w-[60%] bg-surface-container-low p-8 md:p-20">
        {children}
      </section>
    </div>
  );
}