declare module 'ticketType' {
  export interface TopMovieDataProps {
    id: number;
    title: string;
    release_date: string;
    vote_average: number | string;
    overview?: string;
    poster_path?: string;
  }

  export interface MovieDataProps {
    movieId: number;
    movieIndex: number;
    title: string;
    releaseDate: string;
    voteAverage: number | string;
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
    movieId?: number;
    title: string;
    releaseYear: string;
    voteAverage: string | number;
    janres?: string[];
    posterPath?: string;
    overview?: string;
  }

  export interface MovieTicketDetailProps {
    title: string;
    releaseYear: string;
    voteAverage: string | number;
    janres?: string[];
    posterPath?: string;
    reviewText?: string;
  }

  export interface MovieTextDetailProps {
    title: string;
    releaseYear: string;
    voteAverage: string | number;
    janres?: string[];
    reviewText?: string;
  }

  export interface WriteFormProps {
    ticketId: string;
    title: string;
    releaseYear: string;
    rating: string;
    reviewText: string;
    posterImage?: string;
  }

  export interface QueryData {
    title: string;
    releaseYear: string;
    voteAverage: string | number;
    posterImage: string;
    overview: string;
    janreArr: string[];
  }
}
