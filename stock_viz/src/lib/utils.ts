import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const BASE_URL = "http://127.0.0.1:5000/";

export const fetchAPI = async (url: string,option?:any) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`,option);

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};


export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}