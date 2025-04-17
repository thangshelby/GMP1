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

export  const getSectorFromIndustry = (industry: string): string => {
  const sectorObj = sectors.find(s => s.industries.includes(industry));
  return sectorObj ? sectorObj.sector : "";
};

const sectors = [
  {
    sector: "Vật liệu",
    industries: ["Hóa chất", "Tài nguyên Cơ bản"],
  },
  {
    sector: "Tiêu dùng thiết yếu",
    industries: ["Thực phẩm và đồ uống"],
  },
  {
    sector: "Tiêu dùng không thiết yếu",
    industries: [
      "Hàng cá nhân & Gia dụng",
      "Bán lẻ",
      "Ô tô và phụ tùng",
      "Du lịch và Giải trí",
    ],
  },
  {
    sector: "Công nghiệp",
    industries: ["Hàng & Dịch vụ Công nghiệp", "Xây dựng và Vật liệu"],
  },
  {
    sector: "Tài chính",
    industries: ["Ngân hàng", "Dịch vụ tài chính", "Bảo hiểm"],
  },
  {
    sector: "Dịch vụ truyền thông",
    industries: ["Truyền thông"],
  },
  {
    sector: "Bất động sản",
    industries: ["Bất động sản"],
  },
  {
    sector: "Tiện ích",
    industries: ["Điện, nước & xăng dầu khí đốt"],
  },
  {
    sector: "Năng lượng",
    industries: ["Dầu khí", "Điện, nước & xăng dầu khí đốt"], // Có thể overlap
  },
  {
    sector: "Công nghệ",
    industries: ["Công nghệ Thông tin"],
  },
  {
    sector: "Y tế",
    industries: ["Y tế"],
  },
];
