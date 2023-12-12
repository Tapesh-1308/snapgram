import { getCurrentUser } from "../lib/appwrite/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

export const initialState = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false
};

export const checkAuthUser = createAsyncThunk(
  'auth/checkAuthUser', async (_, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const currAccount = await getCurrentUser();
      if (currAccount) {
        dispatch(setUser({
          id: currAccount.$id,
          name: currAccount.name,
          username: currAccount.username,
          email: currAccount.email,
          imageUrl: currAccount.imageUrl,
          bio: currAccount.bio
        }));

        dispatch(setIsAuthenticated(true));
        return true;
      }
    } catch (error) {
      console.log("Error :: checkAuthUser :: ", error.message);
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  }
)


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  }
});

export const { setUser, setIsLoading, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;
