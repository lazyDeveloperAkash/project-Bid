import { configureStore } from "@reduxjs/toolkit"
import userReducer  from "./reducers/userReducer"
import projectReducer from "./reducers/projectReducer"


export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
