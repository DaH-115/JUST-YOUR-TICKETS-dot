"use client";

import { useState, useEffect } from "react";

interface ProfileStats {
  myTicketsCount: number;
  likedTicketsCount: number;
  activityLevel: string | null;
  loading: boolean;
  error: string | null;
}

export default function useProfileStats(uid: string | undefined): ProfileStats {
  const [stats, setStats] = useState<ProfileStats>({
    myTicketsCount: 0,
    likedTicketsCount: 0,
    activityLevel: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setStats({
        myTicketsCount: 0,
        likedTicketsCount: 0,
        activityLevel: null,
        loading: false,
        error: null,
      });
      return;
    }

    const fetchStats = async () => {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`/api/users/${uid}?includeFullStats=true`);

        if (!response.ok) {
          throw new Error("Failed to fetch user stats");
        }

        const userData = await response.json();

        setStats({
          myTicketsCount: userData.stats?.myTicketsCount || 0,
          likedTicketsCount: userData.stats?.likedTicketsCount || 0,
          activityLevel: userData.activityLevel || null,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "통계 데이터를 불러오는데 실패했습니다.",
        }));
      }
    };

    fetchStats();
  }, [uid]);

  return stats;
}
