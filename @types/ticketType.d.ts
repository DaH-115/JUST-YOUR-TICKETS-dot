declare module 'ticketType' {
  export interface MovieDataProps {
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

  export interface UserTicketDetailsProps {
    title: string;
    releaseYear: string;
    posterImage: string;
    rating: string;
    reviewText: string;
  }
}
