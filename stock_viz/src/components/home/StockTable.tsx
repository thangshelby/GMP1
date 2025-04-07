import { ReviewStockType } from "@/types";
import Link from "next/link";
import { fetchAPI } from "@/lib/utils";
import { format, subMonths } from "date-fns";
export default async function StockTable() {
  const endDate = format(subMonths(new Date(), 1), "yyyy-MM-dd");
  const data: ReviewStockType[] = await fetchAPI(
    `stocks/stocks_review?quantity=${10}&end_date=${endDate}`,
  );


  return (
    <table className="custom-table w-full table-auto border-collapse rounded-lg border border-gray-300">
      <thead className="">
        <tr className="text-secondary text-[10px] font-extralight">
          <th className="w-[30px] text-start">Symbol</th>
          <th className="w-[30px] text-end">Last</th>
          <th className="w-[30px] text-end">Change</th>
          <th className="w-[30px] text-end">Volume</th>
          <th className="w-[120px] pr-2 text-end">Signal</th>
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 20).map((stock) => (
          <tr
            key={stock.symbol}
            className="group px-4 text-[10px] hover:cursor-pointer hover:bg-[#353945]"
          >
            <td className="text-primary text-start hover:underline">
              <Link href={`/stockchart?symbol=${stock.symbol}`}>
                {stock.symbol}
              </Link>
            </td>
            <td className="text-secondary text-end">
              <Link href={`/stockchart?symbol=${stock.symbol}`}>
                {stock.last}
              </Link>
            </td>
            <td
              className={`${stock.change > 0 ? "text-green" : "text-red"} text-end group-hover:text-[#81cf90]`}
            >
              <Link href={`/stockchart?symbol=${stock.symbol}`}>
                {stock.change}%
              </Link>
            </td>
            <td className="text-secondary text-end">
              <Link href={`/stockchart?symbol=${stock.symbol}`}>
                {stock.volume}
              </Link>
            </td>
            <td className="text-primary text-end hover:underline">
              <Link href={`/stockchart?symbol=${stock.symbol}`}>
                {stock.signal}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
