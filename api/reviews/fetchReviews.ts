export interface Review {
  number?: number;
  id: string;
  uid: string;
  userName: string;
  movieId: string;
  movieTitle: string;
  moviePosterPath: string;
  releaseYear: string;
  rating: number;
  reviewTitle: string;
  reviewContent: string;
  createdAt: string;
  likeCount: number;
}
