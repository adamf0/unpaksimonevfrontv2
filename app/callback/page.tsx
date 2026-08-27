"use client";

import { useEffect } from "react";
import { startSSOLogin } from "../Module/Common/Service/keycloak";

export default function CallbackPage() {
  useEffect(() => {
    startSSOLogin(`${window.location.origin}/callback_sso`);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-body text-on-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-lg font-medium">Processing SSO Login...</p>
      </div>
    </div>
  );
}
