import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@prisma/client";

interface TransactionWithDetails extends Transaction {
  book: { name: string };
  member: { name: string };
}

interface TransactionState {
  transactions: TransactionWithDetails[];
}

const initialState: TransactionState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<TransactionWithDetails[]>) {
      state.transactions = action.payload;
    },
  },
});

export const { setTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
