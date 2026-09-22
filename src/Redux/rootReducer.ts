import { baseApi } from "./api/baseApi";
import authReducer from "./Slices/authSlice";
import layoutSlice from "./Slices/dashboardLayout/layoutSlice";
import productQuerySlice from "./Slices/productQuerySlice";
import productSlice from "./Slices/productSlice";
import utilitySlice from "./Slices/unitlitySlice";
import userSlice from "./Slices/userSlice";

const rootReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  authReducer: authReducer,
  layoutReducer: layoutSlice,
  utilityReducer: utilitySlice,
  userReducer: userSlice,
  productQueryReducer: productQuerySlice,
  productReducer: productSlice,
};

export default rootReducer;
