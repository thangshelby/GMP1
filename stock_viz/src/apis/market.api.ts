import http from "./http"

export const getSymbolReview  = async (date:string,prepare_for:string) => {
    const response = await http.get(`market/symbols_review`,{
        params:{
            prepare_for,
            date
        }
    });
    return response.data;
}

export const getMarketOverview = async (date:string) => {
    const response = await http.get(`market/market_overview`,{
        params:{
            date:date
        }
    });
    return response.data;
}