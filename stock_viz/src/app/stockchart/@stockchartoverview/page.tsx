"use client";
import { useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/utils";
import { useState, useEffect, Suspense } from "react";
import { StockOverviewInformationType } from "@/types";
import { FaSearch } from "react-icons/fa";

export default function StockChartOverview() {
  const symbol = useSearchParams().get("symbol");
  const [allStocks, setAllStocks] = useState<allStocksType[]>([]);
  const [input, setInput] = useState<string>("");
  const [ricMatch, setRicMatch] = useState<allStocksType[]>([]);

  const [stockOverviewInfor, setStockOverviewInfor] =
    useState<StockOverviewInformationType>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPI(
        `stocks/stock_overview_information?symbol=${symbol}`,
      );
      const response2 = await fetchAPI("/stocks/all_stock_rics");
      setAllStocks(response2);
      console.log(response2);
      setStockOverviewInfor(response[0]);
    };
    fetchData();
  }, [symbol]);

  useEffect(() => {
    const match = allStocks.filter((stock) => {
      return (
        stock.symbol.toLocaleLowerCase().includes(input) ||
        stock.name.toLocaleLowerCase().includes(input)
      );
    });
    setRicMatch(match);
  }, [input]);

  return (
    <div className="flex flex-row items-center justify-between bg-[#181b22] px-[2rem] py-[1rem]">
      {/* HEADER 1 */}
      <div className="flex flex-col">
        <div className="flex flex-row items-end gap-x-[0.8rem]">
          <h1 className="text-secondary text-3xl leading-[1.2] font-bold">
            {symbol?.toLocaleUpperCase()}
          </h1>
          <p className="text-primary text-xl font-semibold">
            {stockOverviewInfor?.short_name}s
          </p>
        </div>
        <div className="flex flex-row items-center gap-x-[0.6rem]">
          <p className="text-primary text-xs font-semibold">
            {stockOverviewInfor?.exchange}
          </p>
          <p className="text-primary text-xs font-semibold">
            {stockOverviewInfor?.company_type}
          </p>
          <p className="text-primary text-xs font-semibold">
            {stockOverviewInfor?.industry}
          </p>

          <p className="text-primary text-xs font-semibold">VND</p>
        </div>
      </div>

      {/* HEADER 2 */}
      <div className="flex w-[25%] flex-col items-end">
        <div className="relative w-full">
          <div className="flex w-full flex-row items-center gap-x-[0.8rem] rounded-md bg-[#262626] p-2 focus-within:border-[0.1rem] focus-within:border-white focus-within:bg-[#141414]">
            {/* <FaSearch className="text-white" size={12} /> */}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent text-xs text-white outline-none placeholder:text-sm"
              placeholder="Tìm kiếm"
            />
          </div>
          {input.length > 0 && (
            <div className="dow-2xl absolute left-0 z-50 mt-[0.6rem] h-[18rem] w-full gap-y-[0.6rem] overflow-y-scroll rounded-xl bg-[#22262f] p-[0.8rem] py-[1rem] hover:cursor-pointer">
              {ricMatch.length ? (
                ricMatch.map((stock, index) => (
                  <div
                    onClick={() => {
                      window.location.href = `/stockchart?symbol=${stock.symbol.split(":")[1].toLocaleLowerCase()}`;
                    }}
                    key={index}
                    className={`flex flex-row items-center justify-between gap-x-[1rem] rounded-lg p-1 hover:bg-[#363a46]`}
                  >
                    <p className="text-primary text-2xs font-semibold">
                      {stock.symbol}
                    </p>
                    <p className="text-primary truncate text-center text-2xs font-semibold">
                      {stock.name}
                    </p>

                    <p className="text-primary text-2xs font-semibold text-right">
                      {stock.exchange}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-row items-center justify-center text-3xl font-semibold text-white">
                  Không tìm thấy mã cổ phiếu
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
interface allStocksType {
  symbol: string;
  name: string;
  exchange: string;
  market: string;
  sector: string;
}
