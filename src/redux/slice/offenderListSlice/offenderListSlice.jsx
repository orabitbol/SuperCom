import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getOffenderListFromApi = createAsyncThunk(
  "offenderList/getOffenderListFromApi",
  async () => {
    const response = await axios.get("/src/data/data.json");
    return response.data.offendersList;
  }
);
const initialStateOfOffederList = {
  offenderList: [],
};

export const offenderListSlice = createSlice({
  name: "offenderList",
  initialState: {
    offenderList: initialStateOfOffederList,
  },
  reducers: {
    setOffendersList: (state, action) => {
      state.offenderList.push(action.payload);
    },
    removeOffender: (state, action) => {
      const offenderIdToRemove = action.payload;
      state.offenderList = state.offenderList.filter(
        (offender) => offender.id !== offenderIdToRemove
      );
    },
    editOffender: (state, action) => {
      const { id, newData } = action.payload;
      console.log("id", id);
      console.log("newData", newData);
      const offenderIndex = state.offenderList.findIndex(
        (offender) => offender.id === id
      );
      console.log("offenderIndex", offenderIndex);
      if (offenderIndex !== -1) {
        // Create a new array with the updated offender object
        const updatedOffenderList = [
          ...state.offenderList.slice(0, offenderIndex), // All elements before the updated offender
          { ...state.offenderList[offenderIndex], ...newData }, // The updated offender
          ...state.offenderList.slice(offenderIndex + 1), // All elements after the updated offender
        ];
        console.log("updatedOffenderList", updatedOffenderList);

        // Replace the old array with the new one in the state
        state.offenderList = updatedOffenderList;
        console.log("state.offenderList", state.offenderList);
      }
    },
  },
  extraReducers: (builder) => {
    // Handle the async thunk results
    builder
      .addCase(getOffenderListFromApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOffenderListFromApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.offenderList = action.payload;
      })
      .addCase(getOffenderListFromApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setOffendersList, removeOffender, editOffender } =
  offenderListSlice.actions;

export default offenderListSlice.reducer;

const offenderList = (state) => state.offenderList.offenderList;

export const offenderListSelector = createSelector(
  [offenderList],
  (offenderList) => {
    console.log("offenderList", offenderList);
    return offenderList;
  }
);
