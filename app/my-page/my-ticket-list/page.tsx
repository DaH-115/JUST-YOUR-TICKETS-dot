"use client";

import { useEffect, useState } from "react";
import { db } from "firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import SideMenu from "app/my-page/side-menu";
import { Review } from "app/ticket-list/page";
import TicketList from "app/ticket-list/ticket-list";

export default function MySideReviewList() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  const fetchUserReviews = async () => {
    try {
      const reviewsRef = collection(db, "movie-reviews");
      const userReviewsQuery = query(reviewsRef, where("userUid", "==", uid));
      const querySnapshot = await getDocs(userReviewsQuery);
      const reviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setUserReviews(reviews);
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };

  useEffect(() => {
    if (!uid) return;
    fetchUserReviews();
  }, [uid]);

  const handleReviewDeleted = () => {
    fetchUserReviews();
  };

  return (
    <div id="layout" className="mt-24 flex w-full px-8">
      <SideMenu uid={uid as string} />
      <div id="side-review-list" className="w-full px-8">
        <div className="flex items-center p-6 pb-0">
          <div className="mr-4 text-2xl font-bold">MY TICKET LIST</div>
          <div>총 {userReviews.length}개</div>
        </div>
        <div className="grid grid-cols-3 gap-4 p-6">
          <TicketList
            reviews={userReviews}
            onReviewDeleted={handleReviewDeleted}
          />
        </div>
      </div>
    </div>
  );
}
