import { getFromLocalStorage } from "@/utils/local-storage";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ILayoutSlice {
  isOpenSideBar: boolean;
  layoutState: boolean;
  isOpenLayoutSidbar: boolean;
}

const layoutStateFromLocalStorage = getFromLocalStorage("layoutState") as
  | boolean
  | null;

const initialState: ILayoutSlice = {
  isOpenSideBar: true,
  layoutState: layoutStateFromLocalStorage === ("true" as unknown) || false,
  isOpenLayoutSidbar: false,
};

const layoutSlice = createSlice({
  name: "layoutSlice",
  initialState,
  reducers: {
    setOpenLeftSidebar(state) {
      state.isOpenSideBar = !state.isOpenSideBar;
    },
    toggleLayoutSidebar(state, action: PayloadAction<boolean>) {
      state.isOpenLayoutSidbar = action.payload;
    },
    setLayoutState(state, action: PayloadAction<boolean>) {
      state.layoutState = action.payload;
    },

    sidebarToggle(state) {
      state.isOpenSideBar = !state.isOpenSideBar;
    },
  },
});

export const {
  setOpenLeftSidebar,
  sidebarToggle,
  toggleLayoutSidebar,
  setLayoutState,
} = layoutSlice.actions;
export default layoutSlice.reducer;
