"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
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

        // 2. 좋아요한 티켓 개수 가져오기 (실제 존재하는 리뷰만 카운트)
        // 각 좋아요 데이터가 가리키는 리뷰가 실제로 존재하는지 확인
        const likedReviewsSnapshot = await getDocs(
          collection(db, "users", uid, "liked-reviews"),
        );

        // 실제로 유효한 좋아요 개수를 저장할 변수
        let validLikedCount = 0;
        // 삭제된 리뷰에 대한 좋아요 데이터를 정리하기 위한 Promise 배열
        const cleanupPromises: Promise<void>[] = [];

        // 각 좋아요 데이터에 대해 해당 리뷰가 실제로 존재하는지 확인
        const checkPromises = likedReviewsSnapshot.docs.map(
          async (likedDoc) => {
            const reviewId = likedDoc.id; // 좋아요한 리뷰의 ID
            const reviewRef = doc(db, "movie-reviews", reviewId);
            const reviewSnapshot = await getDoc(reviewRef);

            if (reviewSnapshot.exists()) {
              // ✅ 리뷰가 존재함 → 유효한 좋아요
              return true;
            } else {
              // ❌ 리뷰가 삭제됨 → 무효한 좋아요 데이터
              // 이 무효한 좋아요 데이터를 정리 대상에 추가
              // (실제 삭제는 나중에 실행하여 사용자가 기다리지 않도록 함)
              cleanupPromises.push(deleteDoc(likedDoc.ref));
              return false;
            }
          },
        );

        // 모든 검사 작업을 병렬로 실행하고 결과를 기다림
        const results = await Promise.all(checkPromises);
        // 유효한 좋아요만 카운트 (true인 것들만 세기)
        validLikedCount = results.filter((exists) => exists).length;

        // 무효한 좋아요 데이터 정리 작업 실행
        // await를 사용하지 않아서 사용자는 이 작업을 기다리지 않음
        // 다음번 계산 시 성능 향상을 위한 데이터 정리
        if (cleanupPromises.length > 0) {
          Promise.all(cleanupPromises).catch((error) => {
            console.warn("좋아요 데이터 정리 중 오류:", error);
          });
        }

        setStats({
          myTicketsCount: myReviewsCount.data().count,
          likedTicketsCount: validLikedCount,
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
