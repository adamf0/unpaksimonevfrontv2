"use client";

import Icon from "../../Common/Components/Atoms/Icon";
import { useRouter } from 'next/navigation';

export default function Complete() {
  const router = useRouter();
  
  return (
    <section className="animate-fade-in-up" id="success">
      <div className="bg-white rounded-3xl p-12 shadow-[0_32px_64px_-16px_rgba(63,81,181,0.12)] border border-indigo-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  alt="Success Professional"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzsRWOQ4EUdc1Oz5We994-LZ0ITmBJx4s_YsxgrcSDBWz6tWSEeuj7f3n-Pjy12P-fKnvxdqQWDvpKnh3oP2kj19YVVPKOXx8ovBi7l97a4PoiAn4ogIy3E3s3rp7Z7CoF0TgZRfpyDiYlMuPYed57Yq-6dUZLGT1m3jrXLzZCM6OLeY3NYHI9oVlUE3Vrti3V3JkTL5LbjfEwmtSl7uoBhY7g6AtAN-1rl8knmCHuN4L7rpb0FgqCrX_f_aUeCIo3haxfOOsWdks"
                />
              </div>
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="font-headline text-5xl font-extrabold text-on-surface mb-6 leading-tight">
              Mission Accomplished.
            </h1>
            <p className="text-lg text-on-surface-variant mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Your quest update has been synchronized with the campus mainframe.
              All systems are green and your academic progress has been secured.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => router.push("/")} className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                <Icon name="home"/>
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
