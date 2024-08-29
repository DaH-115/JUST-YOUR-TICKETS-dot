export default function SimilarMovie({ id }: { id: number }) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}/${id}/similar?language=ko-KR&page=1`;

  return <div>SimilarMovie</div>;
}
