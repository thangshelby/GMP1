'use client'
import { useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/utils";
import { useState, useEffect,Suspense } from "react";
import { StockOverviewInformationType } from "@/types";
import {FaSearch} from 'react-icons/fa'


export default function StockChartOverview() {
  const symbol = useSearchParams().get("symbol");

  const [stockOverviewInfor, setStockOverviewInfor] =
    useState<StockOverviewInformationType>();
  const [serchSymbol, setSerchSymbol] = useState<string>("");

  useEffect(() => {
    const fetchData= async()=>{
      const response= await fetchAPI(
        `stocks/stock_overview_information?symbol=${symbol}`,
      )
      setStockOverviewInfor(response[0]);  
    }
    fetchData();
  
  }, [symbol]);


  return (
    <div className="flex flex-row items-center justify-between bg-[#181b22] px-[2rem] py-[1rem]">
    {/* HEADER 1 */}
    <div className="flex flex-col">
      <div className="flex flex-row items-end gap-x-[0.8rem]">
        <h1 className="text-3xl font-bold leading-[1.2] text-secondary">
          {symbol?.toLocaleUpperCase()}
        </h1>
        <p className="text-xl font-semibold text-primary">
          {stockOverviewInfor?.short_name}s
        </p>
      </div>
      <div className="flex flex-row items-center gap-x-[0.6rem]">
        <p className="text-xs font-semibold text-primary">
          {stockOverviewInfor?.exchange}
        </p>
        <p className="text-xs font-semibold text-primary">
          {stockOverviewInfor?.company_type}
        </p>
        <p className="text-xs font-semibold text-primary">
          {stockOverviewInfor?.industry}
        </p>

        <p className="text-xs font-semibold text-primary">
          VND
        </p>
      </div>
    </div>

    {/* HEADER 2 */}
    <div className=" flex flex-col items-end w-[25%]">
      <div className="relative w-full">
        <div className="flex w-full flex-row items-center gap-x-[0.8rem] rounded-md bg-[#262626]  focus-within:border-[0.1rem] p-2 focus-within:border-white focus-within:bg-[#141414]">
          {/* <FaSearch className="text-white" size={12} /> */}

          <input
            type="text"
            value={serchSymbol}
            onChange={(e) => setSerchSymbol(e.target.value)}
            className="bg-transparent text-xs text-white outline-none placeholder:text-sm"
            placeholder="Tìm kiếm"
          />
        </div>
        {/* {input.length > 0 && (
          <div className="absolute left-0 z-50 mt-[0.6rem] h-[18rem] w-full gap-y-[0.6rem] overflow-y-scroll rounded-xl bg-[#22262f] p-[0.8rem] py-[1rem]   dow-2xl hover:cursor-pointer">
            {ricMatch.length ? (
              ricMatch.map((stock, index) => (
                <div
                  onClick={() => {
                    window.location.href = `/stock/lazy/${stock.RIC.split(".")[0].toLocaleLowerCase()}`;
                  }}
                  key={index}
                  className={`flex flex-row items-center justify-between gap-x-[1rem] rounded-lg p-[0.4rem] py-[0.3rem] hover:bg-[#363a46]`}
                >
                  <p className="text-xs font-semibold text-primary">
                    {stock.RIC}
                  </p>
                  <p className="truncate text-start text-xs font-semibold text-primary">
                    {stock.Name}
                  </p>

                  <p className="text-xs font-semibold text-primary">
                    {stock.Exchange}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-row items-center justify-center text-white text-3xl font-semibold h-full">
                Không tìm thấy mã cổ phiếu
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  </div>
  )
}
