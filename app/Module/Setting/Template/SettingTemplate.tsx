"use client";

import { useSetting } from "../Hook/useSetting";

export default function SettingTemplate() {
  const {
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
  } = useSetting();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-outline font-medium animate-pulse">
          Memuat pengaturan akun pribadi...
        </p>
      </div>
    );
  }

  const roleLevel = String(account?.Level || "ADMIN").toUpperCase();
  const resourceType = String(account?.Resource || "local").toUpperCase();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1200px] mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary/60 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            {account?.Name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-on-surface tracking-tight">
                {account?.Name || "Pengguna"}
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                {roleLevel}
              </span>
            </div>
            <p className="text-xs text-outline font-medium mt-1">
              Username: <span className="font-mono text-on-surface font-semibold">{account?.Username || "-"}</span> | Sumber Akun:{" "}
              <span className="font-semibold text-primary">{resourceType}</span>
            </p>
          </div>
        </div>

        {/* Scope Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {account?.Fakultas && (
            <div className="px-3 py-1.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 border border-outline-variant/10">
              <span className="material-symbols-outlined text-sm text-primary">domain</span>
              Fakultas: {account.Fakultas}
            </div>
          )}
          {account?.Prodi && (
            <div className="px-3 py-1.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 border border-outline-variant/10">
              <span className="material-symbols-outlined text-sm text-primary">school</span>
              Prodi: {account.Prodi}
            </div>
          )}
          {account?.Unit && (
            <div className="px-3 py-1.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 border border-outline-variant/10">
              <span className="material-symbols-outlined text-sm text-primary">apartment</span>
              Unit: {account.Unit}
            </div>
          )}
        </div>
      </div>

      {/* FORM SECTION */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: PERSONAL INFORMATIONS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant/10 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">Informasi Pribadi</h3>
                <p className="text-xs text-outline">Kelola nama lengkap dan kontak email akun Anda</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Username (Read Only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">Username / NIK / NIP / NPM</label>
                <input
                  type="text"
                  disabled
                  value={account?.Username || ""}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm font-mono text-outline cursor-not-allowed border border-transparent"
                />
                <p className="text-[11px] text-outline/80">Username tidak dapat diubah (digunakan untuk otentikasi login)</p>
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">Alamat Email</label>
                <input
                  type="email"
                  placeholder="contoh: user@unpak.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SECURITY / CHANGE PASSWORD */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant/10 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">Ubah Password</h3>
                <p className="text-xs text-outline">Kosongkan jika tidak ingin mengubah password</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Password Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-surface-container-low px-4 py-3 pr-10 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ketik ulang password baru..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface-container-low px-4 py-3 pr-10 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* BUTTON ACTION */}
            <div className="pt-4 border-t border-outline-variant/10">
              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 active:scale-[0.99] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan Perubahan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">save</span>
                    Simpan Perubahan Akun
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
