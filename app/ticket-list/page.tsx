"use client";

import { useEffect, useState } from "react";
import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useAppSelector } from "store/hooks";
import { useAppDispatch } from "store/hooks";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import TicketList from "app/ticket-list/ticket-list";

export interface Review {
  date: string;
  id: string;
  movieTitle: string;
  movieId: string;
  posterImage: string;
  rating: number;
  releaseYear: string;
  review: string;
  reviewTitle: string;
  userUid: string;
  userName: string;
}

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    newReviewAlertState && dispatch(addNewReviewAlertHandler());
  }, [newReviewAlertState]);

  useEffect(() => {
    try {
      const getPosts = async () => {
        const querySnapshot = await getDocs(collection(db, "movie-reviews"));
        const reviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Review[];
        setReviews(reviews);
      };
      getPosts();
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }, []);

  return (
    <div className="mt-16 grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <TicketList reviews={reviews} />
    </div>
  );
}
