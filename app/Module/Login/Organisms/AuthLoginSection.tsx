import { useNavigate, useSearchParams } from "react-router-dom";
import apiCall from "../../Common/External/APICall";
import { useForm } from "react-hook-form";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { Suspense, useEffect, useRef } from "react";
import { useToast } from "../../Common/Context/ToastContext";
import getTokenExpiry from "../../Common/Service/tokenExpiry";
import { startSSOLogin } from "../../Common/Service/keycloak";
import { cn } from "@/lib/utils";

import Icon from "../../Common/Components/Atoms/Icon";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import SocialButton from "../Molecules/SocialButton";
import Divider from "../../Common/Components/Molecules/Divider";
import InputField from "../Molecules/InputField";

type LoginForm = {
  username: string;
  password: string;
};

export default function AuthLoginSection() {
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasShown = useRef(false);

  const allowedFields = ["username", "password"];

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  useEffect(() => {
    const reason = searchParams.get("r");
    if (!reason || hasShown.current) return;

    hasShown.current = true;

    let message = "";
    switch (reason) {
      case "Ex":
        message = "Sesi login berakhir";
        break;
      case "E0":
        message = "Terjadi masalah pada session Anda.";
        break;
      case "E1":
        message = "Tidak dapat mengambil informasi akun.";
        break;
      case "F0":
        message = "Akun Anda tidak memiliki akses ke sistem ini.";
        break;
    }

    if (message !== "") {
      pushToast(message);
    }
    sessionStorage.clear();

    // hapus query parameter dari state router dan URL agar tidak muncul lagi saat direfresh
    setSearchParams({}, { replace: true });
    window.history.replaceState({}, "", window.location.pathname);
  }, [searchParams, setSearchParams, pushToast]);

  const handleSSOLogin = async () => {
    await startSSOLogin(`${window.location.origin}/callback_sso`);
  };

  const onSubmit = async (input: LoginForm) => {
    try {
      const formData = new FormData();
      formData.append("username", input.username);
      formData.append("password", input.password);

      const { data } = await apiCall.post("/login", formData);
      const accessToken = data?.access_token;
      const refreshToken = data?.refresh_token;

      if (refreshToken) {
        sessionStorage.setItem("refresh_token", refreshToken);
        document.cookie = `refresh_token=${refreshToken}; path=/`;
      }

      if (accessToken) {
        sessionStorage.setItem("access_token", accessToken);

        let exp: number | null = null;
        try {
          exp = getTokenExpiry(accessToken);
        } catch (e) {
          console.warn("Decode token gagal", e);
        }

        if (exp) {
          sessionStorage.setItem("access_token_exp", exp.toString());
          document.cookie = `access_token_exp=${exp}; path=/`;
        }

        document.cookie = `access_token=${accessToken}; path=/`;
      }

      navigate("/dashboard");
    } catch (error: any) {
      if (!error.response) {
        pushToast("Ada masalah pada server");
        return;
      }

      const { status, data } = error.response;

      const cfError = handleCloudflareError(status);
      if (cfError) {
        pushToast(cfError);
        return;
      }

      if (data?.code === "Account.InvalidCredential") {
        pushToast("username / password tidak valid");
        return;
      }

      if (data?.code?.endsWith(".Validation")) {
        const messages = data.message;

        Object.keys(messages).forEach((field) => {
          if (!allowedFields.includes(field)) return;

          setError(field as keyof LoginForm, {
            type: "server",
            message: messages[field],
          });
        });

        return;
      }

      pushToast(data?.message || "Ada masalah pada server");
    }
  };

  function LoadingFallback() {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-surface">
        <div className="w-full max-w-[480px]">
          <div className="lg:hidden flex flex-col items-center gap-4 mb-12">
            <div className="bg-primary p-3 rounded-2xl text-on-primary shadow-xl shadow-primary/20">
              <Icon name="school" className="!text-3xl" />
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-on-background">
              Unpak Simonev
            </h2>
          </div>
          <div className="mb-10 text-center lg:text-left">
            <h3 className="font-headline text-4xl font-bold text-on-surface mb-3">
              Welcome Back
            </h3>
            <p className="text-on-surface-variant text-lg">
              Please enter your credentials to continue your quest.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <InputField
                id="username"
                label="Username or Email"
                placeholder="e.g. academic.student@campus.edu"
                icon="alternate_email"
                {...register("username", {
                  required: "Username wajib diisi",
                })}
              />
              {errors.username && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <InputField
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                icon="lock"
                labelAction={
                  <a
                    href="#"
                    className="text-sm font-bold text-primary hover:text-primary-dim transition-colors"
                  >
                    Forgot Password?
                  </a>
                }
                {...register("password", {
                  required: "Password wajib diisi",
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <AnimatedButton
              type="submit"
              disabled={isSubmitting}
              className={cn(
                `w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all duration-200`,
                isSubmitting
                  ? "bg-primary/70 cursor-not-allowed text-on-primary"
                  : "bg-primary text-on-primary shadow-primary/30 hover:bg-primary-dim",
              )}
              icon="arrow_forward"
            >
              {isSubmitting ? "Loading..." : "Login to Portal"}
            </AnimatedButton>
          </form>

          <Divider>Or continue with</Divider>

          <div className="grid grid-cols-1 gap-4">
            <SocialButton
              label="SSO Unpak"
              icon="account_balance"
              className="py-4 px-4 bg-surface-container-highest/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container-highest"
              onClick={handleSSOLogin}
            />
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <a
              className="flex items-center gap-2 text-xs font-bold text-outline hover:text-primary transition-colors uppercase tracking-widest"
              href="#"
            >
              <Icon name="help_outline" className="!text-sm" />
              Need technical assistance?
            </a>
          </div>
        </div>
      </section>
    </Suspense>
  );
}
