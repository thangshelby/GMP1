import http from "./http";

export const getScreener = async (endDate: string,page:number) => {
    const response = await http.get(`screener`, {
        params: {
            end_date: endDate,
            page: page,
        }
    });
    return response.data;
}