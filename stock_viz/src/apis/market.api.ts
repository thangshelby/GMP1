import http from "./http"

export const getSymbolReview  = async (date:string,prepare_for:string,is_quote:boolean) => {
    const response = await http.get(`market/symbols_review`,{
        params:{
            prepare_for,
            date,
            is_quote:is_quote 
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