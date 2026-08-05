const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DashboardStatsData {
  total_responden: number;
  active_surveys: number;
  total_prodi: number;
  total_fakultas: number;
  rata_rata_rating: number;
}

export async function fetchDashboardStats(): Promise<DashboardStatsData | null> {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token") || ""}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data as DashboardStatsData;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}
