import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { MovieDataProps } from 'ticketType';

export interface movieDetailsProps {
  title: string;
  release_date: string;
  poster_path: string;
}

interface initialStateProps {
  movieList: MovieDataProps[] | [];
  movieDetails: movieDetailsProps | {};
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: initialStateProps = {
  movieList: [],
  movieDetails: {},
  status: 'idle',
  error: undefined,
};

export const getTicketDetails = createAsyncThunk(
  'ticket/get',
  async (movieId: string) => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`
    );
    const { title, release_date, poster_path } = res.data as movieDetailsProps;
    const contents = {
      title,
      release_date,
      poster_path,
    };

    return contents;
  }
);

const movieSlice = createSlice({
  name: 'movieData',
  initialState,
  reducers: {
    getMovieListData: (state, action: PayloadAction<MovieDataProps[]>) => {
      state.movieList = action.payload.map((item: MovieDataProps) => ({
        id: item.id,
        title: item.title,
        release_date: item.release_date.slice(0, 4),
        vote_average: item.vote_average,
        overview: item.overview,
        poster_path: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : undefined,
      }));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTicketDetails.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getTicketDetails.fulfilled, (state, action) => {
      state.status = 'succeeded';
      const { title, release_date, poster_path } = action.payload;
      const newMovieDetails = {
        title,
        release_date: release_date.slice(0, 4),
        poster_path,
      };

      state.movieDetails = newMovieDetails;
    });
    builder.addCase(getTicketDetails.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.code;
    });
  },
});

export default movieSlice;
export const { getMovieListData } = movieSlice.actions;
