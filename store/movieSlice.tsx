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
  isStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  isError: string;
}

const initialState: initialStateProps = {
  movieList: [],
  movieDetails: {},
  isStatus: 'idle',
  isError: '',
};

export const getTicketDetails = createAsyncThunk<
  movieDetailsProps,
  string,
  { rejectValue: string }
>('ticket/get', async (movieId, thunkAPI) => {
  try {
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
  } catch (error) {
    return thunkAPI.rejectWithValue('문제가 발생했습니다.');
  }
});

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
      state.isStatus = 'loading';
    });
    builder.addCase(getTicketDetails.fulfilled, (state, action) => {
      state.isStatus = 'succeeded';
      const { title, release_date, poster_path } = action.payload;
      const newMovieDetails = {
        title,
        release_date: release_date.slice(0, 4),
        poster_path,
      };

      state.movieDetails = newMovieDetails;
    });
    builder.addCase(getTicketDetails.rejected, (state, action) => {
      state.isStatus = 'failed';
      state.isError = action.payload || '';
    });
  },
});

export default movieSlice;
export const { getMovieListData } = movieSlice.actions;
