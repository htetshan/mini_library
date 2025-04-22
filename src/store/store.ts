import { configureStore } from "@reduxjs/toolkit";
import memeberSliceReducer from "./slices/memberSlice";
import bookSliceReducer from "./slices/bookSlice";
import appSliceReducer from "./slices/appSlice";
// ...

export const store = configureStore({
  reducer: {
    members: memeberSliceReducer,
    books: bookSliceReducer,
    app: appSliceReducer,
    /*     posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer, */
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
