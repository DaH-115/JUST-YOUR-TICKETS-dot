import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";

async function getPosts() {
  const querySnapshot = await getDocs(collection(db, "movie-reviews"));
  const reviews = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return reviews;
}

export default async function Page() {
  const reviews = await getPosts();

  return (
    <div className="mt-16 flex space-x-2 p-6">
      {reviews.map((post: any) => (
        // REVIEW CARD
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
              <p className="">{post.review}</p>
            </div>
            <div className="border-t-2 border-black p-2">
              누르면 상세 페이지로 이동
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
