import http from "./http";

export const getNews = async (category: string, subcategory: string) => {
  const response = await http.get(`/news/`, {
    params: {
      category,
      subcategory,
    },
  });

  return response.data;
};
