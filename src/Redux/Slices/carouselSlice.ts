import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageSet {
  main?: string;
  image2?: string;
  image3?: string;
}

interface CarouselItem {
  images: ImageSet;
}

interface CarouselState {
  carousels: CarouselItem[];
  activeCarousel: number | null;
}

const initialState: CarouselState = {
  carousels: [],
  activeCarousel: null,
};

const carouselSlice = createSlice({
  name: "carousel",
  initialState,
  reducers: {
    createCarousel: (state, action: PayloadAction<CarouselItem[]>) => {
      state.carousels = action.payload;
    },
    deleteCarousel: (state, action: PayloadAction<number>) => {
      state.carousels.splice(action.payload, 1);
      if (state.activeCarousel === action.payload) {
        state.activeCarousel = null;
      }
    },
    setActiveCarousel: (state, action: PayloadAction<number | null>) => {
      state.activeCarousel = action.payload;
    },
  },
});

export const { createCarousel, deleteCarousel, setActiveCarousel } = carouselSlice.actions;
export default carouselSlice.reducer;
