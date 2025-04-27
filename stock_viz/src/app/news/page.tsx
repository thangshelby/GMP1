"use client";
import React from "react";
import { NewsItemProp } from "@/types";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/apis/news.api";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
export const News = () => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<keyof typeof newsCateories>("stock");
  const [selectedSubCategory, setSelectedSubCategory] = React.useState("share");

  const result = useQuery({
    queryKey: ["news", selectedCategory, selectedSubCategory],
    queryFn: () => getNews(selectedCategory, selectedSubCategory),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`border-secondary flex flex-row items-center justify-center gap-4 border-b-[2px] p-2`}
      >
        {Object.keys(newsCateories).map((category) => (
          <div
            key={category}
            onClick={() => {
              setSelectedCategory(category as keyof typeof newsCateories);
              setSelectedSubCategory(
                Object.keys(
                  newsCateories[category as keyof typeof newsCateories],
                )[0],
              );
            }}
            className={`${category == selectedCategory ? "text-primary font-semibold" : "text-secondary font-medium"} text-md hover:cursor-pointer`}
          >
            {category.slice(0, 1).toUpperCase() +
              category.slice(1).replaceAll("_", " ")}
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center justify-start px-10">
        <span className="text-secondary-2 text-xs font-bold">View By</span>

        <div className="flex flex-row items-center pl-4">
          {Object.keys(newsCateories[selectedCategory]).map((subCategory) => (
            <div
              className={`${subCategory == selectedSubCategory ? "border-primary bg-button border-[1px] text-white" : "text-secondary font-medium"} rounded-sm px-2 py-[2px] text-sm hover:cursor-pointer`}
              key={subCategory}
              onClick={() => setSelectedSubCategory(subCategory)}
            >
              {subCategory
                .split("_")
                .join(" ")
                .replace(/^\w/, (c) => c.toUpperCase())}
            </div>
          ))}
        </div>
      </div>

      {result.isLoading && (
        <div className="flex w-[80%] flex-col px-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <NewsItemSkeleton key={index} />
          ))}
        </div>
      )}

      {result.isSuccess && (
        <div className="flex w-[80%] flex-col px-6">
          {result.data.map((item: NewsItemProp, index: number) => (
            <NewsItem item={item} id={index} key={item.title + index.toString()} />
          ))}
        </div>
      )}
    </div>
  );
};

export default News;

const NewsItemSkeleton = () => {
  return (
    <div className="border-b-secondary flex flex-row justify-between border-b-1 p-2">
      <div className="flex w-[70%] flex-col gap-1">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-1/4" />

      </div>
      <Skeleton className="h-24 w-32 rounded-lg" />
    </div>
  );
};


const NewsItem = ({item,id}:{item:NewsItemProp,id:number}) => {
  return (
    <div
      onClick={() => {
        window.open(item.link, "_blank");
      }}
      key={item.title+ id.toString()}
      className="border-b-secondary flex flex-row justify-between border-b-1 p-2 hover:cursor-pointer"
    >
      <div className="flex w-[70%] flex-col gap-1">
        <p className="text-primary text-md font-semibold">
          {item.title.length > 80
            ? item.title.slice(0, 80) + "..."
            : item.title}
        </p>
        <span className="text-secondary text-sm font-medium">
          {item.description}
        </span>
        <span className="text-secondary-2 text-xs font-thin">
          {format(new Date(item.public_date), "MMMM dd, yyyy")}
        </span>
      </div>
      <Image className="h-24 w-32 rounded-lg" src={item.img_src} alt={item.title} style={{
        width: "auto",
        height: "100%",
      }} />
    </div>
  );
};

const newsCateories = {
  stock: {
    share: "https://vietstock.vn/830/chung-khoan/co-phieu.rss",
    insider_trading:
      "https://vietstock.vn/739/chung-khoan/giao-dich-noi-bo.rss",
    listed: "https://vietstock.vn/741/chung-khoan/niem-yet.rss",
    etf_and_funds: "https://vietstock.vn/3358/chung-khoan/etf-va-cac-quy.rss",
    derivatives:
      "https://vietstock.vn/4186/chung-khoan/chung-khoan-phai-sinh.rss",
    covered_warrant: "https://vietstock.vn/4308/chung-khoan/chung-quyen.rss",
    expert_opinion:
      "https://vietstock.vn/145/chung-khoan/y-kien-chuyen-gia.rss",
    investment_story:
      "https://vietstock.vn/3355/chung-khoan/cau-chuyen-dau-tu.rss",
    policy: "https://vietstock.vn/143/chung-khoan/chinh-sach.rss",
    bond: "https://vietstock.vn/785/chung-khoan/thi-truong-trai-phieu.rss",
  },
  business: {
    business_activity:
      "https://vietstock.vn/737/doanh-nghiep/hoat-dong-kinh-doanh.rss",
    dividend: "https://vietstock.vn/738/doanh-nghiep/co-tuc.rss",
    capital_increase_ma:
      "https://vietstock.vn/764/doanh-nghiep/tang-von-m-a.rss",
    ipo_equitization:
      "https://vietstock.vn/746/doanh-nghiep/ipo-co-phan-hoa.rss",
    character: "https://vietstock.vn/214/doanh-nghiep/nhan-vat.rss",
    corporate_bond:
      "https://vietstock.vn/3118/doanh-nghiep/trai-phieu-doanh-nghiep.rss",
  },
  real_estate: {
    real_estate_market:
      "https://vietstock.vn/4220/bat-dong-san/thi-truong-nha-dat.rss",
    planning_infrastructure:
      "https://vietstock.vn/42221/bat-dong-san/quy-hoach-ha-tang.rss",
    real_estate_projects: "https://vietstock.vn/4222/bat-dong-san/du-an.rss",
    real_estate_insurance_tax:
      "https://vietstock.vn/4266/bat-dong-san/bao-hiem-va-thue-nha-dat.rss",
  },
  goods: {
    precious_metals:
      "https://vietstock.vn/759/hang-hoa/vang-va-kim-loai-quy.rss",
    fuel: "https://vietstock.vn/34/hang-hoa/nhien-lieu.rss",
    metal: "https://vietstock.vn/742/hang-hoa/kim-loai.rss",
    agriculture_food:
      "https://vietstock.vn/118/hang-hoa/nong-san-thuc-pham.rss",
  },
  finance: {
    banking: "https://vietstock.vn/757/tai-chinh/ngan-hang.rss",
    insurance: "https://vietstock.vn/3113/tai-chinh/bao-hiem.rss",
    tax_budget: "https://vietstock.vn/758/tai-chinh/thue-va-ngan-sach.rss",
  },
  economy: {
    macro: "https://vietstock.vn/761/kinh-te/vi-mo.rss",
    economy_investment: "https://vietstock.vn/768/kinh-te/kinh-te-dau-tu.rss",
  },
  world: {
    global_stocks: "https://vietstock.vn/773/the-gioi/chung-khoan-the-gioi.rss",
    crypto: "https://vietstock.vn/4309/the-gioi/tien-ky-thuat-so.rss",
    international_finance:
      "https://vietstock.vn/772/the-gioi/tai-chinh-quoc-te.rss",
    global_economy_industry:
      "https://vietstock.vn/775/the-gioi/kinh-te-nganh.rss",
  },
  dong_duong: {
    indochina_macro_investment:
      "https://vietstock.vn/1326/dong-duong/vi-mo-dau-tu.rss",
    indochina_finance_banking:
      "https://vietstock.vn/1327/dong-duong/tai-chinh-ngan-hang.rss",
    indochina_stock_market:
      "https://vietstock.vn/1328/dong-duong/thi-truong-chung-khoan.rss",
    indochina_economy_industry:
      "https://vietstock.vn/1329/dong-duong/kinh-te-nganh.rss",
  },
  personal_finance: {
    personal_finance_mastery:
      "https://vietstock.vn/4260/tai-chinh-ca-nhan/lam-chu-dong-tien.rss",
    small_investment_business:
      "https://vietstock.vn/4261/tai-chinh-ca-nhan/dau-tu-kinh-doanh-nho.rss",
    entrepreneurship_startup:
      "https://vietstock.vn/4262/tai-chinh-ca-nhan/doanh-nhan-va-khoi-nghiep.rss",
    luxury_lifestyle:
      "https://vietstock.vn/4263/tai-chinh-ca-nhan/choi-sang.rss",
    automotive_technology:
      "https://vietstock.vn/4264/tai-chinh-ca-nhan/xe-cong-nghe.rss",
    consumer_lifestyle:
      "https://vietstock.vn/4265/tai-chinh-ca-nhan/tieu-dung-va-cuoc-song.rss",
    for_community:
      "https://vietstock.vn/735/tai-chinh-ca-nhan/vi-cong-dong.rss",
  },
  analysis: {
    market_analysis:
      "https://vietstock.vn/1636/nhan-dinh-phan-tich/nhan-dinh-thi-truong.rss",
    fundamental_analysis:
      "https://vietstock.vn/582/nhan-dinh-phan-tich/phan-tich-co-ban.rss",
    technical_analysis:
      "https://vietstock.vn/585/nhan-dinh-phan-tich/phan-tich-ky-thuat.rss",
  },
};
