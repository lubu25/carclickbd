import { PROFILE_INFO_KEY } from "@/constant/storegeKey";
import { IUser } from "@/Interface/user";
import { handleLoggedIn, isLoggedIn, Logout } from "@/service/auth.service";
import {
  getFromLocalStorageAsParse,
  setToLocalStorageAsStringify,
} from "@/utils/local-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Define the initial state interface
export interface IinitialState {
  isLoggedIn: boolean;
  profile: IUser | null;
  isOpenAuthModal: boolean;
}

// Initialize the state using a function
const initializeState = (): IinitialState => ({
  isLoggedIn: isLoggedIn() || false,
  profile: getFromLocalStorageAsParse(PROFILE_INFO_KEY),
  isOpenAuthModal: false,
});

const initialState = initializeState();

// Create the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleAuthModal: (state) => {
      state.isOpenAuthModal = !state.isOpenAuthModal;
    },
    setIsLoggedIn: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      handleLoggedIn(action.payload);
    },
    setLogOut: (state) => {
      state.isLoggedIn = false;
      Logout();
    },
    setProfileInfo: (state, action: PayloadAction<IUser | any>) => {
      if (action.payload) {
        setToLocalStorageAsStringify(PROFILE_INFO_KEY, action.payload);
        state.profile = action.payload;
      }
    },
  },
});

// Export actions and reducer
export const { setIsLoggedIn, setLogOut, setProfileInfo, toggleAuthModal } =
  authSlice.actions;
export default authSlice.reducer;
