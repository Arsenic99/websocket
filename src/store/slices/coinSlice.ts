import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState: any = {
    cryptoCoins: []
}

export const coinSlice = createSlice({
    name: 'coin',
    initialState,
    reducers: {
        setCoin: (state, action) => { // запись всех валют
            state.cryptoCoins = action.payload.map((item: any) => {
                if(item.symbol === undefined) console.log("item", item)
                return {
                    ...item,
                    "s": item.symbol,
                    "p": item.priceChange,
                    "P": item.priceChangePercent,
                    "w": item.weightedAvgPrice,
                    "c": item.lastPrice,
                    "o": item.openPrice,
                    "h": item.highPrice,
                    "l": item.lowPrice,
                    "v": item.volume,
                    "q": item.quoteVolume,
                    "O": item.openTime,
                    "C": item.closeTime,
                    "F": item.firstId,
                    "L": item.lastId,
                };
            });
        },

        updateCoin: (state, action) => { //обновление данных валют
            state.cryptoCoins = state.cryptoCoins.map((item: any) => {
                const updatedCoin = action.payload.find((updated: any) => updated.s === item.s);
                return updatedCoin ? { ...item, ...updatedCoin } : item;
            });

            const existingSymbols = new Set(state.cryptoCoins.map((coin: any) => coin.s));
            const newCoins = action.payload.filter((updated: any) => !existingSymbols.has(updated.s));

            state.cryptoCoins = [...state.cryptoCoins, ...newCoins];
        }
    }
})

export const { setCoin, updateCoin } = coinSlice.actions;

export const selectCoin = (state: RootState) => state.coin;

export default coinSlice.reducer;
