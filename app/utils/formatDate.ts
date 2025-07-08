const formatDate = (
  dateString: string | Date | null,
  includeTime: boolean = true,
) => {
  if (!dateString) {
    return "방금 전"; // serverTimestamp가 아직 설정되지 않은 경우
  }

  const date = new Date(dateString);

  // 유효하지 않은 날짜인 경우
  if (isNaN(date.getTime())) {
    return "알 수 없음"; // 데이터 오류
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (includeTime) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
  }

  return date.toLocaleDateString("ko-KR", formatOptions);
};

export default formatDate;
