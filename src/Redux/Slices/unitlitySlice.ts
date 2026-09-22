import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IinitialState {
  isProductQuickView: boolean;
}

const initialState: IinitialState = {
  isProductQuickView: false,
};

export const utilitySlice = createSlice({
  name: "utilitySlice",
  initialState,
  reducers: {
    // setProductQuickView: (state) => {
    //   state.isProductQuickView = !state.isProductQuickView;
    // },
  },
});

// export const { setProductQuickView } = utilitySlice.actions;
export default utilitySlice.reducer;
