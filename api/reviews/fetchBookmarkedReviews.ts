import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";

interface BookmarkedReview {
  id: string;
  bookmarkedAt: string;
}

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

const fetchBookmarkedReviews = async (
  uid: string,
): Promise<BookmarkedReview[]> => {
  const bookmarkRef = collection(db, "users", uid, "bookmarked-reviews");
  const snapshot = await getDocs(bookmarkRef);
  const convertTimestampToString = (timestamp: FirestoreTimestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
    return "";
  };

  return snapshot.docs.map((doc) => ({
    id: doc.id, // Review ID
    bookmarkedAt: convertTimestampToString(doc.data().bookmarkedAt),
  }));
};

export default fetchBookmarkedReviews;
