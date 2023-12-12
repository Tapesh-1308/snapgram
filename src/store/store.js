import { configureStore } from "@reduxjs/toolkit";

import AuthSliceReducer from "./authSlice";

const store = configureStore({
    reducer: {
        auth: AuthSliceReducer,
    }
})

export default store;