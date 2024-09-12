"use client";

import { useEffect, useState } from "react";
import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";

export default function Page() {
  const [reviews, setReviews] = useState<any>();
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
    <div className="mt-16 flex space-x-2 p-6">
      {reviews &&
        reviews.map((post: any) => (
          <div key={post.id} className="relative h-[600px] w-1/5">
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
                <p className="px-4 text-4xl font-bold">{post.rating}</p>
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
    </div>
  );
}
