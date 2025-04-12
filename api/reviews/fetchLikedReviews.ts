import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";

export interface LikedReview {
  id: string;
  likedAt: string;
}

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

const fetchLikedReviews = async (uid: string): Promise<LikedReview[]> => {
  const likeRef = collection(db, "users", uid, "liked-reviews");
  const likeSnapshot = await getDocs(likeRef);
  const convertTimestampToString = (timestamp: FirestoreTimestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
    return "";
  };

  return likeSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id, // Review ID
      likedAt: convertTimestampToString(data.likedAt),
    };
  });
};

export default fetchLikedReviews;
