declare module 'ticketType' {
  export interface TopMovieDataProps {
    title: string;
    release_date: string;
    id: number;
    overview?: string;
    vote_average?: number;
    poster_path?: string;
  }

  export interface MovieDataProps {
    title: string;
    releaseDate: string;
    movieId: number;
    movieIndex: number;
    voteAverage?: number | string;
    posterPath?: string;
    overview?: string;
  }

  export interface UserTicketProps {
    id: string;
    title: string;
    releaseYear: string;
    rating: string;
    createdAt: number;
    reviewText: string;
    posterImage?: string;
  }

  export interface MovieInfoProps {
    title: string;
    releaseYear: string;
    voteAverage?: number | string;
    posterPath?: string;
    posterImage?: string;
    reviewText?: string;
    overview?: string;
    janre?: string[];
  }

  export interface WriteFormProps {
    ticketId: string;
    title: string;
    releaseYear: string;
    rating: string;
    reviewText: string;
    posterImage?: string;
  }
}
