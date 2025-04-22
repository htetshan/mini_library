import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setMembers } from "./memberSlice";
import { setBooks } from "./bookSlice";

// Initial state
interface AppSliceType {
  init: boolean;
  isLoading: boolean;
  error: Error | null;
}
const initialState: AppSliceType = {
  init: false,
  isLoading: false,
  error: null,
};

export const appFetchServer = createAsyncThunk(
  "appSlice/appFetchServer",
  async (_, thunkApi) => {
    const response = await fetch(`/api/app`);
    const dataFromServer = await response.json();
    const { members, books } = dataFromServer;
    thunkApi.dispatch(setMembers(members));
    thunkApi.dispatch(setBooks(books));
    thunkApi.dispatch(setInit(true));
    /* const { menus, menuCategories, company, menuCategoryMenus } =
      dataFromServer;
    thunkApi.dispatch(setMenu(menus));
    thunkApi.dispatch(setMenuCategories(menuCategories));
    thunkApi.dispatch(setMenuCategoryMenu(menuCategoryMenus));
    thunkApi.dispatch(setCompany(company));
    thunkApi.dispatch(setInit(true)); */
  }
);

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setInit: (state, action: PayloadAction<boolean>) => {
      state.init = action.payload;
    },
  },
});

// Export actions
export const { setInit } = appSlice.actions;

// Export reducer
export default appSlice.reducer;
