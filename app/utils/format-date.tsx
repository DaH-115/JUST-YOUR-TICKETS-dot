import { Timestamp } from "firebase/firestore";

export default function formatDate(timestamp: Timestamp) {
  return timestamp.toDate().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
