"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { PersonalAccountInfo } from "../Attribut/SettingTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useSetting() {
  const [account, setAccount] = useState<PersonalAccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /** =========================
   * FETCH WHOAMI PROFILE
   * ========================= */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("access_token") || "";
      const res = await fetch(`${BASE_URL}/whoami`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengambil profil akun");

      const data: PersonalAccountInfo = await res.json();
      setAccount(data);
      setName(data.Name || "");
      setEmail(data.Email || "");
    } catch (err: any) {
      console.error("fetchProfile error:", err);
      toast.error("Gagal memuat profil akun");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /** =========================
   * HANDLE SAVE CHANGES
   * ========================= */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nama lengkap tidak boleh kosong");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok!");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setSaving(true);
    try {
      const token = sessionStorage.getItem("access_token") || "";
      const uuid = account?.UUID || account?.ID || "";

      const formData = new FormData();
      formData.append("username", account?.Username || "");
      formData.append("level", account?.Level || "admin");
      formData.append("name", name);
      if (email) formData.append("email", email);
      if (account?.RefFakultas) formData.append("fakultas", account.RefFakultas);
      if (account?.RefProdi) formData.append("prodi", account.RefProdi);

      if (newPassword) {
        formData.append("password", newPassword);
      }

      const res = await fetch(`${BASE_URL}/account/${uuid}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Gagal memperbarui akun");
      }

      toast.success("Profil akun pribadi berhasil diperbarui!");
      setNewPassword("");
      setConfirmPassword("");
      await fetchProfile();
    } catch (err: any) {
      console.error("handleSave error:", err);
      toast.error(err.message || "Gagal menyimpan perubahan profil");
    } finally {
      setSaving(false);
    }
  };

  return {
    account,
    loading,
    saving,

    name,
    setName,
    email,
    setEmail,

    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,

    handleSave,
    refreshProfile: fetchProfile,
  };
}
