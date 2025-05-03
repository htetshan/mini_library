import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setMembers } from "./memberSlice";
import { setBooks } from "./bookSlice";
import { config } from "@/config";
import { setTransactions } from "./transactionSlice";

// Initial state

type SuccessOrError = "success" | "error";
interface AppSnackBarSliceType {
  openState: boolean;
  successOrError: SuccessOrError;
  messages: string;
}
const initialState: AppSnackBarSliceType = {
  openState: false,
  successOrError: "success",
  messages: "",
};

export const AppSliceBarSlice = createSlice({
  name: "AppSliceBarSlice",
  initialState,
  reducers: {
    showSnackBar: (state, action: PayloadAction<AppSnackBarSliceType>) => {
      const { openState, successOrError, messages } = action.payload;
      state.openState = openState;
      state.successOrError = successOrError;
      state.messages = messages;
    },
    hideSnackBar: (state) => {
      state.openState = false;
      state.successOrError = "success";
      state.messages = "";
    },
  },
});

// Export actions
export const { showSnackBar, hideSnackBar } = AppSliceBarSlice.actions;

// Export reducer
export default AppSliceBarSlice.reducer;
