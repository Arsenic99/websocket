import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const coinApi = createApi({
    reducerPath: 'coinApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.binance.com/api/v3/' }),
    endpoints: (build) => ({
        getCoinByName: build.query<any, any>({
            //query: () => `ticker?symbols=["BTCUSDT","ETHUSDT","BNBUSDT","BCCUSDT","NEOUSDT"]`,
            query: () => `exchangeInfo`,
            transformResponse: (response: any) => {
                return response.symbols
                    .filter((s: any) => s.quoteAsset === 'USDT')
            },
        }),
    }),
})

export const { useGetCoinByNameQuery } = coinApi