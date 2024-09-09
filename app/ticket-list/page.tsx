import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";

async function getPosts() {
  const querySnapshot = await getDocs(collection(db, "movie-reviews"));
  const testpost = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return testpost;
}

export default async function Page() {
  const posts = await getPosts();

  return (
    <div className="mt-16">
      {posts.map((post: any) => (
        <div key={post.id}>
          <p>{post.date}</p>
          <p>{post.title}</p>
          <p>{post.rating}</p>
          <p>{post.review}</p>
        </div>
      ))}
    </div>
  );
}
