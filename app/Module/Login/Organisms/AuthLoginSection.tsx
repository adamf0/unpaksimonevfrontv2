"use client";

import Icon from "../../Common/Components/Atoms/Icon";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
// import RememberMe from "../Molecules/RememberMe";
import SocialButton from "../Molecules/SocialButton";
import Divider from "../../Common/Components/Molecules/Divider";
import InputField from "../Molecules/InputField";
import { useRouter, useSearchParams } from "next/navigation";
import apiCall from "../../Common/External/APICall";
import { useForm } from "react-hook-form";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { useEffect, useRef } from "react";
import { useToast } from "../../Common/Context/ToastContext";
import getTokenExpiry from "../../Common/Service/tokenExpiry";

export default function AuthLoginSection() {
  const { pushToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShown = useRef(false);

  type LoginForm = {
    username: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  useEffect(() => {
    const reason = searchParams.get("r");
    console.log(reason)
    if (!reason) return;

    let message = "";
    hasShown.current = true;

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

    console.log(message);
    if (message != "") {
      pushToast(message);
    }
    sessionStorage.clear();

    // hapus query biar tidak muncul ulang
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const onSubmit = async (input: LoginForm) => {
    try {
      const formData = new FormData();
      formData.append("username", input.username);
      formData.append("password", input.password);

      const { data } = await apiCall.post("/login", formData);
      const accessToken = data?.access_token;
      const refreshToken = data?.refresh_token;

      if (accessToken) { //ini ada nilainya
        sessionStorage.setItem("access_token", accessToken);
        document.cookie = `access_token=${accessToken}; path=/`;

        let exp: number | null = null;
        try {
          exp = getTokenExpiry(accessToken);
        } catch (e) {
          console.warn("Decode token gagal", e);
        }

        if (exp) {
          sessionStorage.setItem("access_token_exp", exp.toString());
        }
      }

      if (refreshToken) {
        sessionStorage.setItem("refresh_token", refreshToken);
      }

      router.push("/dashboard");
    } catch (error: any) {
      if (!error.response) {
        pushToast("Ada masalah pada server");
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

      if (data?.code === "Login.Validation") {
        const messages = data.message;

        Object.keys(messages).forEach((field) => {
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

  return (
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

          {/* <RememberMe
            id="remember"
            name="remember"
            label="Remember this session"
          /> */}

          <AnimatedButton
            type="submit"
            className="w-full py-5 bg-primary text-on-primary rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary-dim"
            icon="arrow_forward"
          >
            Login to Portal
          </AnimatedButton>
        </form>

        <Divider>Or continue with</Divider>

        <div className="grid grid-cols-2 gap-4">
          <SocialButton
            label="Google"
            className="py-4 px-4 bg-surface-container-highest/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container-highest"
            customIcon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            }
            onClick={() =>
              alert(
                "fitur masih tahap pengembangan. ini akan aktif ketika sso terimplementasi.",
              )
            }
          />
          <SocialButton
            label="SSO Unpak"
            icon="account_balance"
            className="py-4 px-4 bg-surface-container-highest/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container-highest"
            onClick={() =>
              alert(
                "fitur masih tahap pengembangan. ini akan aktif ketika sso terimplementasi.",
              )
            }
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
  );
}
