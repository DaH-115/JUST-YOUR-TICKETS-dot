import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from 'firebase-config';
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { UserTicketDetailsProps } from 'ticketType';

interface UserTicketTypes {
  createdAt: number;
  creatorId: string;
  id: string;
  posterImage: string;
  rating: string;
  releaseYear: string;
  reviewText: string;
  title: string;
}

interface initialStateProps {
  userTicketList: UserTicketTypes[] | [];
  userTicketDetails: UserTicketDetailsProps | {};
  isStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  isError: string;
}

const initialState: initialStateProps = {
  userTicketList: [],
  userTicketDetails: {},
  isStatus: 'idle',
  isError: '',
};

export const getUserTicketDetails = createAsyncThunk<
  UserTicketDetailsProps,
  string,
  { rejectValue: string }
>('userTickets/getDetails', async (ticketId, thunkAPI) => {
  try {
    const userTicketRef = doc(db, 'users-tickets', `${ticketId}`);
    const docSnapshot = await getDoc(userTicketRef);

    const UserTicketDetails = docSnapshot.data() as UserTicketDetailsProps;
    return UserTicketDetails;
  } catch (error) {
    return thunkAPI.rejectWithValue('에러가 발생했습니다.');
  }
});

export const getUserTickets = createAsyncThunk<
  UserTicketTypes[],
  { userId: string; isSorted: boolean },
  { rejectValue: string }
>('userTickets/get', async (user, thunkAPI) => {
  try {
    const ticketRef = collection(db, 'users-tickets');
    const contentQuery = query(
      ticketRef,
      where('creatorId', '==', `${user.userId}`),
      orderBy('createdAt', `${!user.isSorted ? 'desc' : 'asc'}`)
    );
    const dbContents = await getDocs(contentQuery);

    const userTickets = dbContents.docs.map((item: DocumentData) => ({
      id: item.id,
      ...item.data(),
    })) as UserTicketTypes[];

    return userTickets;
  } catch (error) {
    return thunkAPI.rejectWithValue('에러가 발생했습니다.');
  }
});

export const deleteTicket = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('userTickets/deleteTicket', async (ticketId, thunkAPI) => {
  try {
    const userTicketRef = doc(db, 'users-tickets', ticketId);

    await deleteDoc(userTicketRef);

    return ticketId;
  } catch (error) {
    return thunkAPI.rejectWithValue('에러가 발생했습니다.');
  }
});

const userTicketSlice = createSlice({
  name: 'userTicket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserTickets.pending, (state) => {
      state.isStatus = 'loading';
    });
    builder.addCase(getUserTickets.fulfilled, (state, action) => {
      state.isStatus = 'succeeded';
      state.userTicketList = action.payload;
    });
    builder.addCase(getUserTickets.rejected, (state, action) => {
      state.isStatus = 'failed';
      state.isError = action.payload || '';
    });
    builder.addCase(deleteTicket.pending, (state) => {
      state.isStatus = 'loading';
    });
    builder.addCase(deleteTicket.fulfilled, (state, action) => {
      state.isStatus = 'succeeded';
      state.userTicketList = state.userTicketList.filter(
        (item) => item.id !== action.payload
      );
    });
    builder.addCase(deleteTicket.rejected, (state, action) => {
      state.isStatus = 'failed';
      state.isError = action.payload || '';
    });
    builder.addCase(getUserTicketDetails.pending, (state) => {
      state.isStatus = 'loading';
    });
    builder.addCase(getUserTicketDetails.fulfilled, (state, action) => {
      state.isStatus = 'succeeded';
      state.userTicketDetails = action.payload;
    });
    builder.addCase(getUserTicketDetails.rejected, (state, action) => {
      state.isStatus = 'failed';
      state.isError = action.payload || '';
    });
  },
});

export default userTicketSlice;
