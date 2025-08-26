/**
 * 영화 제목을 반환하는 함수
 *
 * @param {string} original_title - 영화 원제
 * @param {string} title - 영화 제목
 * @returns {string} 영화 제목(원제) 또는 제목만 반환
 */
export default function getEnrichMovieTitle(
  original_title: string = "Movie Title",
  title: string = "영화 제목",
) {
  if (original_title === title) {
    return title;
  } else {
    return `${title}(${original_title})`;
  }
}
