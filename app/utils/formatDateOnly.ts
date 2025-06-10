const formatDateOnly = (dateString: string | Date) => {
  if (!dateString) return "";

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
