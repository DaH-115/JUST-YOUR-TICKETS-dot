declare module 'ticketType' {
  export interface TopMovieDataProps {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    overview?: string;
    poster_path?: string;
  }

  export interface MovieDataProps {
    movieId: number;
    title: string;
    releaseDate: string;
    voteAverage: number;
    overview?: string;
    posterPath?: string;
  }

  export interface MovieTicketProps extends MovieDataProps {
    movieIndex: number;
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

  export interface requiredText {
    title: string;
    releaseYear: string;
    voteAverage: number;
  }

  export interface MovieInfoProps extends requiredText {
    movieId?: number;
    janres?: string[];
    posterPath?: string;
    overview?: string;
  }

  export interface MovieTicketDetailProps extends requiredText {
    janres?: string[];
    posterPath?: string;
    reviewText?: string;
  }

  export interface MovieTextDetailProps extends requiredText {
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

  export interface QueryData extends requiredText {
    posterImage: string;
    overview: string;
    janreArr: string[];
  }
}
