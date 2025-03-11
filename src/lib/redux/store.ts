import { configureStore } from '@reduxjs/toolkit'
import slibeBarSlice from './slideBarSlice/slidebar'

export const makeStore = () => {
  return configureStore({
    reducer: {
       slideBar:slibeBarSlice,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']