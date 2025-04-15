import http from "./http"

export const getSymbolReview  = async (endDate:string) => {
    const response = await http.get(`market/symbols_review`,{
        params:{
            quantity:10,
            end_date:endDate
        }
    });
    return response.data;
}