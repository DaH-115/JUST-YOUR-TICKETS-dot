declare module 'ticketType' {
  export interface Top10MovieDataProps {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    overview?: string;
    poster_path?: string;
  }

  export interface MovieDetailProps {
    movieId: number;
    title: string;
    releaseDate: string;
    voteAverage: number;
    overview?: string;
    posterPath?: string;
  }

  export interface MovieTicketProps extends MovieDetailProps {
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

  export interface TicketTextDetailProps extends requiredText {
    genres?: string[];
    posterPath?: string;
    reviewText?: string;
  }

  export interface QueryData extends requiredText {
    posterImage: string;
    reviewText: string;
    rating: string;
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
