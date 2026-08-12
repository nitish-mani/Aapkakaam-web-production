import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: "",
    isSelectedDateValid: true,
    clearDateField: "",
    location_pincode: "",
    location_post: "",
    cancelOrder: false,
    selectLanguage: "en",
    url: "",
    validEmailId: "",
    validPhoneNoId: "",
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setIsSelectedDateValid: (state, action) => {
      state.isSelectedDateValid = action.payload;
    },
    setClearDateField: (state, action) => {
      state.clearDateField = action.payload;
    },
    setLocationPincode: (state, action) => {
      state.location_pincode = action.payload;
    },
    setLocationPost: (state, action) => {
      state.location_post = action.payload;
    },
    setCancelOrder: (state, action) => {
      state.cancelOrder = action.payload;
    },
    setSelectLanguage: (state, action) => {
      state.selectLanguage = action.payload;
    },
    setURL: (state, action) => {
      state.url = action.payload;
    },
    setValidEmailId: (state, action) => {
      state.validEmailId = action.payload;
    },
    setValidPhoneNoId: (state, action) => {
      state.validPhoneNoId = action.payload;
    },
  },
});

export const {
  setCategory,
  setIsSelectedDateValid,
  setClearDateField,
  setLocationPincode,
  setLocationPost,
  setCancelOrder,
  setSelectLanguage,
  setURL,
  setValidEmailId,
  setValidPhoneNoId,
} = categorySlice.actions;
export default categorySlice.reducer;
