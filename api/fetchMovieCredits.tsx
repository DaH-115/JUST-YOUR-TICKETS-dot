export interface CastMember {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

interface CrewMember {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export async function fetchMovieCredits(id: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
    );
    const posts = await res.json();

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    return posts as MovieCredits;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return;
  }
}
