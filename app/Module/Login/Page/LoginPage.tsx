
import AuthHeroSection from "../Organisms/AuthHeroSection";
import AuthLoginSection from "../Organisms/AuthLoginSection";

export default function LoginPage() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex overflow-y">
      <main className="flex w-full min-h-screen">
        <AuthHeroSection/>

        <AuthLoginSection/>
      </main>
    </div>
  );
}
