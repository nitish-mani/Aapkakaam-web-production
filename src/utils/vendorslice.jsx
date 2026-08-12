import { createSlice } from "@reduxjs/toolkit";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    data: [],
    isVisibleVendor: true,
    isPrVisibleVendor: false,
    attendanceData: [],
  },
  reducers: {
    addDataVendor: (state, action) => {
      state.data[0] = action.payload;
    },
    addAttendanceDataVendor: (state, action) => {
      state.attendanceData[0] = action.payload;
    },
    clearDataVendor: (state, action) => {
      state.data = [];
    },
    setIsVisibleVendor: (state, action) => {
      state.isVisibleVendor = action.payload;
    },
    setPrIsVisibleVendor: (state, action) => {
      state.isPrVisibleVendor = action.payload;
    },
  },
});

export const {
  addDataVendor,
  addAttendanceDataVendor,
  clearDataVendor,
  setIsVisibleVendor,
  setPrIsVisibleVendor,
} = vendorSlice.actions;
export default vendorSlice.reducer;
