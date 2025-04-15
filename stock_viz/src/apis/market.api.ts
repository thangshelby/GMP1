import http from "./http"

export const getSymbolReview  = async (endDate:string,quantity:number) => {
    const response = await http.get(`market/symbols_review`,{
        params:{
            quantity:quantity,
            end_date:endDate
        }
    });
    return response.data;
}