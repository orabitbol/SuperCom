import { createSlice, createSelector } from "@reduxjs/toolkit";

export const editOffender = createSlice({
  name: "editOffender",
  initialState: {
    offender: {},
  },
  reducers: {
    setOffender: (state, action) => {
      state.offender = action.payload;
    },
  },
});

export const { setOffender } = editOffender.actions;

export default editOffender.reducer;

const offender = (state) => state.editOffender.offender;

export const offenderSelector = createSelector([offender], (offender) => {
  return offender;
});
