"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebase-config";

interface ProfileStats {
  myTicketsCount: number;
  likedTicketsCount: number;
  loading: boolean;
  error: string | null;
}

export default function useProfileStats(uid: string | undefined): ProfileStats {
  const [stats, setStats] = useState<ProfileStats>({
    myTicketsCount: 0,
    likedTicketsCount: 0,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setStats({
        myTicketsCount: 0,
        likedTicketsCount: 0,
        loading: false,
        error: null,
      });
      return;
    }

    const fetchStats = async () => {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // 1. 내가 쓴 티켓 개수 가져오기
        const myReviewsQuery = query(
          collection(db, "movie-reviews"),
          where("user.uid", "==", uid),
        );
        const myReviewsCount = await getCountFromServer(myReviewsQuery);

        // 2. 좋아요한 티켓 개수 가져오기
        const likedReviewsQuery = query(
          collection(db, "users", uid, "liked-reviews"),
        );
        const likedReviewsCount = await getCountFromServer(likedReviewsQuery);

        setStats({
          myTicketsCount: myReviewsCount.data().count,
          likedTicketsCount: likedReviewsCount.data().count,
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
