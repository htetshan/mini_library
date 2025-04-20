import { Member } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    removeMembers: (state, action: PayloadAction<Member[]>) => {
      state.members = action.payload;
    },
    replaceMembers: (state, action: PayloadAction<Member>) => {
      state.members = state.members.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
  },
});
export const { setMembers, addMembers, removeMembers, replaceMembers } =
  memeberSlice.actions;

export default memeberSlice.reducer;
