export default function getMovieTitle(
  original_title: string = "Movie Title",
  title: string = "영화 제목",
) {
  if (original_title === title) {
    return title;
  } else {
    return `${title}(${original_title})`;
  }
}
