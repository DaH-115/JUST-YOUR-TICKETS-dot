const formatDateOnly = (dateString: string | Date) => {
  if (!dateString) return "";

  // 이미 한국어로 포맷된 문자열인지 확인 (년, 월, 일이 포함된 경우)
  if (
    typeof dateString === "string" &&
    dateString.includes("년") &&
    dateString.includes("월") &&
    dateString.includes("일")
  ) {
    return (
      dateString.split(" ")[0] +
      " " +
      dateString.split(" ")[1] +
      " " +
      dateString.split(" ")[2]
    ); // "2025년 6월 10일" 부분만 추출
  }

  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    console.warn("Invalid date string:", dateString);
    return "";
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default formatDateOnly;
