import { configureStore } from '@reduxjs/toolkit'
import coinSlice from './slices/coinSlice'
import { coinApi } from './queries/api'

export const store = configureStore({
    reducer: {
        coin: coinSlice,
        [coinApi.reducerPath]: coinApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false}).concat(coinApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
