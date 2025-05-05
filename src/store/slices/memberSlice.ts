import { config } from "@/config";
import { baseOptionType } from "@/types/baseOption";
import { Member } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { showSnackBar } from "./snackBarSlice";
import { MemberType } from "@/types/member";

interface MemberSliceType {
  members: Member[];
  isloading: boolean;
  error: null | string;
}
const initialState: MemberSliceType = {
  members: [],
  isloading: false,
  error: null,
};
interface newMemberParamType extends MemberType, baseOptionType {}
export const createNewMemberThunk = createAsyncThunk(
  "memberSlice/createNewMemberThunk",
  async (newMenuParam: newMemberParamType, thunkApi) => {
    try {
      const { onSuccess, onError, ...payload } = newMenuParam;
      const response = await fetch(`${config.api_url}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const dataFromServer = await response.json();
      const { member } = dataFromServer;
      if (!response.ok) {
        //onError && onError();
        thunkApi.dispatch(
          showSnackBar({
            openState: true,
            successOrError: "error",
            messages:
              "A member with this email or phone number already exists.",
          })
        );
        return;
      }
      onSuccess && onSuccess();
      thunkApi.dispatch(addMembers(member));
    } catch (error) {
      console.error("Error downloading member card:", error);
      alert("Failed to create member");
    }
  }
);

export const memeberSlice = createSlice({
  name: "memberSlice",
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<Member[]>) => {
      state.members = action.payload;
    },
    addMembers: (state, action: PayloadAction<Member>) => {
      state.members = [...state.members, action.payload];
    },
    replaceMembers: (state, action: PayloadAction<Member>) => {
      state.members = state.members.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMembers: (state, action: PayloadAction<number>) => {
      state.members = state.members.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});
export const { setMembers, addMembers, removeMembers, replaceMembers } =
  memeberSlice.actions;

export default memeberSlice.reducer;
