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
      const offenderIndex = state.offenderList.findIndex(
        (offender) => offender.id === id
      );
      if (offenderIndex !== -1) {
        const updatedOffenderList = [
          ...state.offenderList.slice(0, offenderIndex),
          { ...state.offenderList[offenderIndex], ...newData },
          ...state.offenderList.slice(offenderIndex + 1),
        ];
        state.offenderList = updatedOffenderList;
      }
    },
  },
  extraReducers: (builder) => {
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

export const { setOffendersList, removeOffender, editOffender } =
  offenderListSlice.actions;

export default offenderListSlice.reducer;

const offenderList = (state) => state.offenderList.offenderList;

export const offenderListSelector = createSelector(
  [offenderList],
  (offenderList) => {
    return offenderList;
  }
);
