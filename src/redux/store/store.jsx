import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import loginReducer from "../slice/auto/loginSlice";
import offenderListReducer from "../slice/offenderListSlice/offenderListSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import editOffenderReducer from "../slice/editOffender/editOffender";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["userId"],
};
const reducer = combineReducers({
  login: loginReducer,
  offenderList: offenderListReducer,
  editOffender: editOffenderReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

// eslint-disable-next-line react-refresh/only-export-components
export default configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
