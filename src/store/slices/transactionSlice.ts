import { Transaction } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* interface Transaction {
    id: number;
    memberId: number;
    bookId: number;
    issuedAt: Date;
    returnedAt: Date | null;
} */

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

const bookSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransaction(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.push(action.payload);
    },
    updateTransaction(state, action: PayloadAction<Transaction>) {
      const index = state.transactions.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    removeTransaction(state, action: PayloadAction<number>) {
      state.transactions = state.transactions.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const {
  setTransaction,
  addTransaction,
  updateTransaction,
  removeTransaction,
} = bookSlice.actions;
export default bookSlice.reducer;
