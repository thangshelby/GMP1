import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { scaleQuantile } from "d3";
import { colorsAndRanges } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BASE_URL = "http://127.0.0.1:5000/";

export const fetchAPI = async (url: string, option?: RequestInit) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, option);

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

 const colorScale = scaleQuantile(
  [-1, 1],
  colorsAndRanges.map((color) => color.color),
);
export const getColor = (value: number) => {
  return colorScale(value);
};
export const formatNumber = (value: number) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
};

