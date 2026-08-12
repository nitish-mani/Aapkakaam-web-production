import { configureStore } from "@reduxjs/toolkit";
import userslice from "./userslice";
import vendorslice from "./vendorslice";
import categoryslice from "./categoryslice";

const store = configureStore({
  reducer: {
    user: userslice,
    vendor: vendorslice,
    category: categoryslice,
  },
});

export default store;
