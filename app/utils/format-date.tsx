import { Timestamp } from "firebase/firestore";

export const formatDate = (timestamp: Timestamp) => {
  return timestamp.toDate().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
