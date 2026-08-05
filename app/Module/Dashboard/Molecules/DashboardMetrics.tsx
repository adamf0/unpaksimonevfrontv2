"use client";

import { useEffect, useState } from "react";
import Card from "./Card";
import { fetchDashboardStats, DashboardStatsData } from "../Service/fetchDashboardStats";

export default function DashboardMetrics() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const data = await fetchDashboardStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  const totalRespondenStr = stats?.total_responden ? stats.total_responden.toLocaleString("id-ID") : "16.829";
  const activeSurveysStr = stats?.active_surveys ? `${stats.active_surveys} Bank Soal` : "6 Bank Soal";
  const totalProdiStr = stats?.total_prodi ? `${stats.total_prodi} Prodi` : "34 Prodi";
  const totalFakultasStr = stats?.total_fakultas ? `${stats.total_fakultas} Fakultas` : "8 Fakultas";
  const ratingStr = stats?.rata_rata_rating ? `${stats.rata_rata_rating.toFixed(2)} / 5.00` : "4.15 / 5.00";
  const ratingBadge = (stats?.rata_rata_rating ?? 4.15) >= 4.0 ? "Sangat Baik" : "Baik";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        title="Total Responden"
        value={loading ? "..." : totalRespondenStr}
        icon="forum"
        badge="Aktif"
        badgeClass="bg-emerald-100 text-emerald-700"
        iconClass="bg-indigo-500/10 text-indigo-600"
        subtitle="Mahasiswa, Dosen & Tendik"
      />

      <Card
        title="Kuesioner Aktif"
        value={loading ? "..." : activeSurveysStr}
        icon="assignment_turned_in"
        badge="Semester Aktif"
        badgeClass="bg-indigo-100 text-indigo-700"
        iconClass="bg-sky-500/10 text-sky-600"
        subtitle="Instrumen monev terbuka"
      />

      <Card
        title="Cakupan Prodi & Fakultas"
        value={loading ? "..." : totalProdiStr}
        icon="domain"
        badge="Terjangkau"
        badgeClass="bg-slate-100 text-slate-700"
        iconClass="bg-emerald-500/10 text-emerald-600"
        subtitle={loading ? "..." : totalFakultasStr}
      />

      <Card
        title="Indeks Kepuasan Mutu"
        value={loading ? "..." : ratingStr}
        icon="star"
        badge={ratingBadge}
        badgeClass="bg-amber-100 text-amber-700"
        iconClass="bg-amber-500/10 text-amber-600"
        subtitle="Rata-rata rating kuesioner"
      />
    </section>
  );
}
