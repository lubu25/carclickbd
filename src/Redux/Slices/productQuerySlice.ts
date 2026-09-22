import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IProductFilterableField = {
  searchTerm: string | null;
  title: string | null;
  interiorColor: string | null;
  exteriorColor: string | null;
  drivetrain: string | null;
  transmission: string | null;
  bodyStyle: string | null;
  make: string | null;
  model: string | null;
  engine: string | null;
  launchingYear: string | null;
  yearRange: string | null;
  sort: "endingSoon" | "newlyListed" | null;
};

export interface IInitialState {
  filter: IProductFilterableField;
  query: string | null;
}

const initialState: IInitialState = {
  filter: {
    searchTerm: null,
    title: null,
    interiorColor: null,
    exteriorColor: null,
    drivetrain: null,
    transmission: null,
    bodyStyle: null,
    make: null,
    model: null,
    engine: null,
    launchingYear: null,
    yearRange: null,
    sort: null,
  },
  query: "/",
};

// Utility function to generate query string
const generateProductQueryString = (
  params: IProductFilterableField,
): string => {
  const queryParameters: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      queryParameters.push(`${key}=${value}`);
    }
  }
  return queryParameters.length > 0 ? `?${queryParameters.join("&")}` : "/";
};

export const productQuerySlice = createSlice({
  name: "productQuery",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string | null>) => {
      state.filter.searchTerm = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setTitle: (state, action: PayloadAction<string | null>) => {
      state.filter.title = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setInteriorColor: (state, action: PayloadAction<string | null>) => {
      state.filter.interiorColor = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setExteriorColor: (state, action: PayloadAction<string | null>) => {
      state.filter.exteriorColor = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setDrivetrain: (state, action: PayloadAction<string | null>) => {
      state.filter.drivetrain = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setTransmission: (state, action: PayloadAction<string | null>) => {
      state.filter.transmission = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setBodyStyle: (state, action: PayloadAction<string | null>) => {
      state.filter.bodyStyle = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setMake: (state, action: PayloadAction<string | null>) => {
      state.filter.make = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setModel: (state, action: PayloadAction<string | null>) => {
      state.filter.model = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setEngine: (state, action: PayloadAction<string | null>) => {
      state.filter.engine = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setLaunchingYear: (state, action: PayloadAction<string | null>) => {
      state.filter.launchingYear = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setYearRange: (state, action: PayloadAction<string | null>) => {
      state.filter.yearRange = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    setSorting: (
      state,
      action: PayloadAction<"endingSoon" | "newlyListed" | null>,
    ) => {
      state.filter.sort = action.payload;
      state.query = generateProductQueryString(state.filter);
    },
    generateProductQuery: (state) => {
      state.query = generateProductQueryString(state.filter);
    },
  },
});

export const {
  setSearchTerm,
  setTitle,
  setInteriorColor,
  setExteriorColor,
  setDrivetrain,
  setTransmission,
  setBodyStyle,
  setMake,
  setModel,
  setEngine,
  setLaunchingYear,
  setYearRange,
  setSorting,
  generateProductQuery,
} = productQuerySlice.actions;

export default productQuerySlice.reducer;
