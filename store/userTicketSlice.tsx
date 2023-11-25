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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: initialStateProps = {
  userTicketList: [],
  userTicketDetails: {},
  status: 'idle',
  error: undefined,
};

export const getUserTicketDetails = createAsyncThunk(
  'userTickets/getDetails',
  async (ticketId: string) => {
    const userTicketRef = doc(db, 'users-tickets', `${ticketId}`);
    const docSnapshot = await getDoc(userTicketRef);

    if (docSnapshot.exists()) {
      const UserTicketDetails = docSnapshot.data() as UserTicketDetailsProps;
      return UserTicketDetails;
    } else {
      return {};
    }
  }
);

export const getUserTickets = createAsyncThunk(
  'userTickets/get',
  async (user: { userId: string; isSorted: boolean }) => {
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
  }
);

export const deleteTicket = createAsyncThunk(
  'userTickets/deleteTicket',
  async (ticketId: string) => {
    const userTicketRef = doc(db, 'users-tickets', ticketId);

    await deleteDoc(userTicketRef);

    return ticketId;
  }
);

const userTicketSlice = createSlice({
  name: 'userTicket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserTickets.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getUserTickets.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.userTicketList = action.payload;
    });
    builder.addCase(getUserTickets.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.code;
    });
    builder.addCase(deleteTicket.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(deleteTicket.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.userTicketList = state.userTicketList.filter(
        (item) => item.id !== action.payload
      );
    });
    builder.addCase(deleteTicket.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.code;
    });
    builder.addCase(getUserTicketDetails.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getUserTicketDetails.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.userTicketDetails = action.payload;
    });
    builder.addCase(getUserTicketDetails.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.code;
    });
  },
});

export default userTicketSlice;
