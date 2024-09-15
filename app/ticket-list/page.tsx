"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useAppSelector } from "store/hooks";
import { useAppDispatch } from "store/hooks";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import { IoStar } from "react-icons/io5";

export default function Page() {
  const [reviews, setReviews] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const newReviewAlertState = useAppSelector(
    (state) => state.newReviewAlert.newReviewAlertState,
  );
  const dispatch = useAppDispatch();

  const openModalHandler = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  useEffect(() => {
    newReviewAlertState ? dispatch(addNewReviewAlertHandler()) : null;
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "movie-reviews"));
      const reviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviews);
    };

    getPosts();
  }, []);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6">
            <p className="mb-2 text-sm font-bold">Review 리뷰</p>
            <p className="mb-6">{modalContent}</p>
            <button
              onClick={closeModalHandler}
              className="w-full rounded bg-black px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="mt-16 grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {reviews &&
          reviews.map((post: any) => (
            <div key={post.id} className="relative h-[600px]">
              <div className="h-4/5">
                <Image
                  src={`https://image.tmdb.org/t/p/original${post.posterImage}`}
                  alt={post.movieTitle}
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                id="info-card"
                className="absolute bottom-0 left-0 w-full border-2 border-black bg-white"
              >
                <div className="flex items-center border-b-2 border-black">
                  <div className="flex items-center justify-center px-2">
                    <IoStar className="mt-2" size={18} />
                    <p className="text-4xl font-bold">{post.rating}</p>
                  </div>
                  <div className="border-l-2 border-black p-2">
                    <p className="text-sm">{post.date}</p>
                    <div className="flex font-bold">
                      <p>
                        {post.movieTitle} - {post.releaseYear}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-2">
                  <p className="text-sm font-bold">{post.reviewTitle}</p>
                  <p id="review-post" className="truncate">
                    {post.review}
                  </p>
                </div>
                <div className="border-t-2 border-black p-2">
                  <button onClick={() => openModalHandler(post.review)}>
                    더 자세히 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        <div className="flex h-[600px] items-center justify-center rounded-xl border-2 border-dotted border-gray-300 p-4">
          <Link href="/search">
            <button className="text-xl font-bold">리뷰 작성하기</button>
          </Link>
        </div>
      </div>
    </>
  );
}
