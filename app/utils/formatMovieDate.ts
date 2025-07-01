export default function formatMovieDate(dateString: string | undefined) {
  if (dateString) {
    const [year, month, day] = dateString.split("-");
    const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${year}년 ${monthName} ${parseInt(day, 10)}일`;
  } else {
    return "";
  }
}
