"use client";

import { db } from "firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import SideMenu from "../side-menu";

interface Review {
  id: string;
  movieTitle: string;
  reviewTitle: string;
  date: string;
  releaseYear: string;
  rating: number;
  userUid: string;
}

export default function MySideReviewList() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const openModalHandler = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const reviewsRef = collection(db, "movie-reviews");
        const userReviewsQuery = query(reviewsRef, where("userUid", "==", uid));
        const querySnapshot = await getDocs(userReviewsQuery);

        if (querySnapshot.empty) {
          console.log("No reviews found for this user.");
          setUserReviews([]);
        } else {
          const reviews = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Review[];
          setUserReviews(reviews);
        }
      } catch (error) {
        console.error("Error getting documents:", error);
      }
    };

    fetchUserReviews();
  }, [uid]);

  return (
    <div id="layout" className="mt-24 flex w-full px-8">
      <SideMenu />

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

      <div id="side-review-list" className="w-full px-8">
        <div className="flex items-center p-6 pb-0">
          <div className="mr-4 text-2xl font-bold">MY REVIEW LIST</div>
          <div>총 {userReviews.length}개</div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3">
          {userReviews &&
            userReviews.map((post: any, index: any) => (
              <div key={post.id} className="relative h-[600px]">
                {/* CARD HEADER */}
                <div className="absolute left-0 top-0 flex w-full items-center justify-between p-2">
                  <p className="rounded-full border-2 border-black bg-white px-4 py-2 font-bold">
                    {index + 1}
                  </p>
                </div>

                <div id="movie-poster" className="h-4/5">
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
                  <div className="border-t-2 border-black">
                    <button
                      className="flex w-full items-center justify-end p-2"
                      onClick={() => openModalHandler(post.review)}
                    >
                      <div className="flex">
                        <p className="mr-2 font-bold">
                          {post.userName ? post.userName : "Guest"}
                        </p>
                        님의 리뷰
                      </div>
                      <FaArrowRight className="ml-2" size={18} />
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
      </div>
    </div>
  );
}
