"use client";

import { IProduct } from "@/Interface/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IInitialState {
  setFormStep: number;
  selectedProduct: IProduct | null;
}

// Function to safely get the value from localStorage
const getInitialFormStep = (): number => {
  if (typeof window !== "undefined") {
    return Number(localStorage.getItem("step")) || 0;
  }
  return 0;
};

// Retrieve the initial step
const initialState: IInitialState = {
  setFormStep: getInitialFormStep(),
  selectedProduct: null,
};

export const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {
    setProductFormStep: (state, action: PayloadAction<number>) => {
      state.setFormStep = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("step", action.payload.toString());
      }
    },
    setSelectedProduct: (state, action: PayloadAction<IProduct>) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const { setProductFormStep, setSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
