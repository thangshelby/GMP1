"use client";
import React from "react";
import { useState } from "react";
import { fetchAPI } from "@/lib/utils";
import { FaSearch } from "react-icons/fa";
import { CiBellOn } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiUser } from "react-icons/ci";

const Header = () => {
  const [allStocks, setAllStocks] = useState<allStocksType[]>([]);
  const [input, setInput] = useState<string>("");
  const [ricMatch, setRicMatch] = useState<allStocksType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPI("/stocks/all_stock_rics");
      setAllStocks(
        response.map((stock: allStocksType) => {
          return {
            symbol: stock.symbol.split(":")[1],
            name: stock.name,
            exchange: stock.exchange,
            market: stock.market,
            sector: stock.sector,
          };
        }),
      );
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const match = allStocks.filter((stock) => {
      return stock.symbol.includes(input) || stock.name.includes(input);
    });
    setRicMatch(match);
  }, [input]);
  return (
    <div className="flex flex-row items-center justify-between p-2">
     <div className="flex-1 flex flex-row items-center gap-4">

      <Logo />

      <div className="flex w-[30%] flex-col items-end">
        <div className="relative w-full">
          <div className="flex w-full flex-row items-center justify-between rounded-3xl bg-[#262626] focus-within:bg-[#141414]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              className="flex-1 bg-transparent pl-6 text-xs text-white outline-none placeholder:text-sm"
              placeholder="Tìm kiếm mã cổ phiếu, tên công ty "
            />

            <div className="rounded-3xl bg-[#00aa76] px-5 py-2">
              <FaSearch color="white" size={"14px"} />
            </div>
          </div>
          {input.length > 0 && (
            <div className="dow-2xl border-gray-2 absolute left-0 z-50 mt-[0.6rem] w-full gap-y-[0.6rem] overflow-y-hidden rounded-lg border-1 bg-[#22262f] p-2 hover:cursor-pointer">
              {ricMatch.length ? (
                ricMatch.slice(0, 12).map((stock, index) => (
                  <div
                    onClick={() => {
                      window.location.href = `/stockchart?symbol=${stock.symbol}`;
                    }}
                    key={index}
                    className={`flex flex-row items-center justify-between gap-x-[1rem] rounded-sm p-1 hover:bg-[#363a46]`}
                  >
                    {stock.symbol.includes(input) ? (
                      <p className={`text-2xs font-semibold text-[#babdc7]`}>
                        {stock.symbol.slice(0, stock.symbol.indexOf(input[0]))}
                        <span className="text-2xs font-semibold text-[#d18325]">
                          {stock.symbol.slice(
                            stock.symbol.indexOf(input[0]),
                            stock.symbol.indexOf(input[0]) + input.length,
                          )}
                        </span>
                        {stock.symbol.slice(
                          stock.symbol.indexOf(input[input.length - 1]) + 1,
                        )}
                      </p>
                    ) : (
                      <p className={`text-2xs font-semibold text-[#babdc7]`}>
                        {stock.symbol}
                      </p>
                    )}

                    {stock.name.includes(input) ? (
                      <p className="text-2xs truncate text-center font-semibold text-[#babdc7]">
                        {stock.name.slice(0, stock.name.indexOf(input[0]))}
                        <span className="text-2xs font-semibold text-[#d18325]">
                          {input}
                        </span>
                        {stock.name.slice(
                          stock.name.indexOf(input) + input.length,
                        )}
                      </p>
                    ) : (
                      <p className="text-2xs truncate text-center font-semibold text-[#babdc7]">
                        {stock.name}
                      </p>
                    )}

                    <p className="text-2xs text-right font-semibold text-[#868ea5]">
                      {stock.exchange}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-row items-center justify-center py-20 text-center text-3xl font-semibold text-white">
                  Không tìm thấy mã cổ phiếu
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        <div className="hover:cursor-pointer">
          <CiBellOn color="white" size={"20px"} />
        </div>

        <div className="flex flex-row items-center gap-1 rounded-2xl border-1 border-[#9fd7ff] px-4 py-[7px] hover:cursor-pointer hover:opacity-80">
          <CiMail color="#9fd7ff" size={"16px"} />
          <span className="text-sm font-semibold text-[#9fd7ff]">Mail</span>
        </div>

        <div className="flex flex-row items-center gap-1 rounded-2xl border-1 border-[#00aa76] px-4 py-[7px] hover:cursor-pointer hover:opacity-80">
        <CiMail color="#00aa76" size={"16px"} />
          <span className="text-sm font-semibold text-[#00aa76]">Sign In</span>
        </div>
      </div>
    </div>
  );
};

export default Header;

interface allStocksType {
  symbol: string;
  name: string;
  exchange: string;
  market: string;
  sector: string;
}

const Logo = () => {
  return (
    <svg
      width="142"
      height="20"
      viewBox="0 0 142 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.2295 5.28637V6.29254C19.6515 5.54398 18.5813 5.02876 17.3418 5.02876C14.4123 5.02876 12.2322 7.62015 12.2322 10.6629C12.2322 13.7914 14.3903 16.2969 17.3418 16.2969C18.5813 16.2969 19.6515 15.8038 20.2295 15.0112V16.0195H23.8777V5.28637H20.2295ZM25.1479 0.530762V16.0217H28.9323V10.2974C28.9323 9.18333 29.4663 8.51843 30.3212 8.51843C31.1761 8.51843 31.6266 9.09747 31.6266 10.1675V16.0217H35.3934V9.27359C35.3934 6.66021 33.9825 5.03096 31.7145 5.03096C31.1747 5.01129 30.6378 5.11947 30.1475 5.3467C29.6572 5.57394 29.2273 5.91384 28.8927 6.33877V0.532966L25.1479 0.530762ZM59.7678 10.6584C59.7678 13.8729 57.3086 16.2925 54.0363 16.2925C50.7639 16.2925 48.3047 13.8707 48.3047 10.6584C48.3047 7.44621 50.7639 5.02438 54.0363 5.02438C57.3086 5.02438 59.7678 7.44621 59.7678 10.6584ZM47.663 10.6584C47.663 13.8729 45.2038 16.2925 41.9337 16.2925C38.6636 16.2925 36.2022 13.8707 36.2022 10.6584C36.2022 7.44621 38.6614 5.02438 41.9337 5.02438C45.206 5.02438 47.663 7.44621 47.663 10.6584ZM0 5.28196L4.57554 16.101L2.92949 20.0001H6.94902L13.0432 5.28196H9.03681L6.55564 11.5809L4.09645 5.28196H0ZM18.111 12.8645C17.8194 12.871 17.5294 12.8187 17.2584 12.7107C16.9873 12.6027 16.7408 12.4412 16.5333 12.2358C16.3258 12.0304 16.1616 11.7853 16.0506 11.5151C15.9396 11.2449 15.8839 10.9551 15.8869 10.6629C15.8842 10.3707 15.9401 10.081 16.0512 9.81094C16.1624 9.54086 16.3265 9.2959 16.5339 9.09056C16.7414 8.88523 16.9878 8.72373 17.2587 8.61561C17.5296 8.5075 17.8194 8.45498 18.111 8.46118C18.4005 8.45794 18.6877 8.51268 18.9558 8.62217C19.2239 8.73167 19.4675 8.89372 19.6722 9.09881C19.8769 9.30391 20.0387 9.5479 20.148 9.81648C20.2573 10.0851 20.3119 10.3728 20.3086 10.6629C20.3122 10.953 20.2578 11.2409 20.1486 11.5096C20.0394 11.7783 19.8776 12.0224 19.6728 12.2276C19.4681 12.4327 19.2244 12.5948 18.9562 12.7042C18.6879 12.8135 18.4006 12.8681 18.111 12.8645ZM44.072 10.6629C44.0788 10.3786 44.0284 10.0959 43.9236 9.83172C43.8188 9.5675 43.6619 9.32718 43.4623 9.12513C43.2627 8.92307 43.0244 8.76344 42.7617 8.65579C42.4991 8.54814 42.2175 8.49466 41.9337 8.4986C41.6499 8.49466 41.3683 8.54814 41.1056 8.65579C40.843 8.76344 40.6047 8.92307 40.4051 9.12513C40.2054 9.32718 40.0485 9.5675 39.9438 9.83172C39.839 10.0959 39.7885 10.3786 39.7954 10.6629C39.7885 10.9471 39.839 11.2297 39.9438 11.494C40.0485 11.7582 40.2054 11.9985 40.4051 12.2006C40.6047 12.4026 40.843 12.5623 41.1056 12.6699C41.3683 12.7776 41.6499 12.831 41.9337 12.8271C42.2175 12.831 42.4991 12.7776 42.7617 12.6699C43.0244 12.5623 43.2627 12.4026 43.4623 12.2006C43.6619 11.9985 43.8188 11.7582 43.9236 11.494C44.0284 11.2297 44.0788 10.9471 44.072 10.6629V10.6629ZM56.1746 10.6629C56.1814 10.3786 56.1309 10.0959 56.0262 9.83172C55.9214 9.5675 55.7645 9.32718 55.5649 9.12513C55.3652 8.92307 55.1269 8.76344 54.8643 8.65579C54.6016 8.54814 54.32 8.49466 54.0363 8.4986C53.7525 8.49466 53.4709 8.54814 53.2082 8.65579C52.9455 8.76344 52.7073 8.92307 52.5076 9.12513C52.308 9.32718 52.1511 9.5675 52.0463 9.83172C51.9416 10.0959 51.8911 10.3786 51.8979 10.6629C51.8911 10.9471 51.9416 11.2297 52.0463 11.494C52.1511 11.7582 52.308 11.9985 52.5076 12.2006C52.7073 12.4026 52.9455 12.5623 53.2082 12.6699C53.4709 12.7776 53.7525 12.831 54.0363 12.8271C54.32 12.831 54.6016 12.7776 54.8643 12.6699C55.1269 12.5623 55.3652 12.4026 55.5649 12.2006C55.7645 11.9985 55.9214 11.7582 56.0262 11.494C56.1309 11.2297 56.1814 10.9471 56.1746 10.6629V10.6629ZM60.2381 13.7452C60.2345 14.0697 60.2957 14.3917 60.4181 14.6922C60.5404 14.9927 60.7214 15.2657 60.9505 15.4951C61.1795 15.7246 61.452 15.906 61.752 16.0285C62.052 16.1511 62.3733 16.2124 62.6973 16.2089C63.0322 16.2115 63.3643 16.1473 63.6743 16.0202C63.9842 15.893 64.2658 15.7053 64.5026 15.468C64.7395 15.2307 64.9268 14.9486 65.0538 14.6381C65.1808 14.3276 65.2448 13.9949 65.2422 13.6593C65.2478 13.3342 65.1881 13.0113 65.0665 12.7099C64.9449 12.4084 64.764 12.1345 64.5345 11.9046C64.305 11.6747 64.0316 11.4935 63.7307 11.3717C63.4298 11.2498 63.1075 11.19 62.783 11.1956C62.4474 11.1933 62.1147 11.2577 61.8042 11.385C61.4936 11.5123 61.2113 11.7 60.9736 11.9373C60.7359 12.1746 60.5476 12.4568 60.4194 12.7675C60.2913 13.0781 60.2259 13.4112 60.2271 13.7474L60.2381 13.7452ZM65.6268 0.535169L61.6072 10.2599H66.0971L70.1166 0.530762L65.6268 0.535169Z"
        fill="var(--yb-finance-logo-brand, #6001D2)"
      ></path>
      <path
        d="M75.2146 5.06825C75.2146 3.92999 75.9223 3.4346 76.8233 3.4346C77.2312 3.43126 77.6345 3.52007 78.0034 3.69441V0.44915C77.4081 0.191512 76.7639 0.0667917 76.1156 0.0836646C73.0895 0.0836646 71.3093 1.95288 71.3093 4.98238V5.32806H69.8721V8.48745H71.3093V16.0744H75.2146V8.48745H77.8518V5.32806H75.2146V5.06825ZM83.1262 16.0766V5.33024H79.2056V16.0766H83.1262ZM83.3614 2.17084C83.3533 1.59228 83.1182 1.04017 82.7069 0.633921C82.2956 0.227671 81.7413 -5.66967e-05 81.1637 1.05881e-08C80.5861 -5.66967e-05 80.0317 0.227671 79.6205 0.633921C79.2092 1.04017 78.9741 1.59228 78.966 2.17084C78.9741 2.74941 79.2092 3.30152 79.6205 3.70777C80.0317 4.11402 80.5861 4.34175 81.1637 4.34169C81.7413 4.34175 82.2956 4.11402 82.7069 3.70777C83.1182 3.30152 83.3533 2.74941 83.3614 2.17084V2.17084ZM104.558 5.33024V6.46851C103.899 5.54381 102.736 5.02861 101.448 5.02861C98.5297 5.02861 96.4067 7.54292 96.4067 10.7023C96.4067 13.8617 98.5077 16.376 101.448 16.376C102.736 16.376 103.866 15.8608 104.558 14.9361V16.0766H108.421V5.33024H104.558ZM104.666 10.7023C104.665 10.9909 104.608 11.2765 104.496 11.5425C104.384 11.8085 104.221 12.0496 104.016 12.2517C103.81 12.4537 103.566 12.6128 103.299 12.7195C103.031 12.8262 102.745 12.8784 102.457 12.8732C102.169 12.8787 101.882 12.8267 101.614 12.7201C101.347 12.6136 101.103 12.4546 100.897 12.2525C100.691 12.0504 100.527 11.8092 100.416 11.543C100.304 11.2769 100.246 10.9911 100.246 10.7023C100.246 10.4136 100.304 10.1278 100.416 9.86164C100.527 9.59549 100.691 9.35431 100.897 9.1522C101.103 8.95009 101.347 8.79111 101.614 8.68453C101.882 8.57796 102.169 8.52592 102.457 8.53148C102.745 8.52621 103.031 8.57847 103.299 8.68518C103.566 8.79189 103.81 8.95093 104.016 9.15301C104.221 9.35509 104.384 9.59615 104.496 9.86215C104.608 10.1282 104.665 10.4138 104.666 10.7023V10.7023ZM116.707 16.0744H120.632V9.24922C120.632 6.62703 119.194 5.01541 116.896 5.01541C115.63 5.01541 114.599 5.55262 113.977 6.55658V5.31043H110.054V16.0568H113.981V10.3325C113.981 9.23162 114.518 8.57112 115.375 8.57112C116.232 8.57112 116.707 9.17436 116.707 10.2047V16.0744ZM91.4114 16.0744H95.3386V9.24922C95.3386 6.62703 93.9014 5.01541 91.6026 5.01541C90.3368 5.01541 89.3082 5.55262 88.6841 6.55658V5.31043H84.7613V16.0568H88.6863V10.3325C88.6863 9.23162 89.2225 8.57112 90.0818 8.57112C90.9411 8.57112 91.4004 9.17436 91.4004 10.2047L91.4114 16.0744ZM121.704 10.7001C121.704 14.1832 124.194 16.3738 127.433 16.3738C128.326 16.3777 129.208 16.1718 130.007 15.7728V12.2039C129.441 12.6209 128.758 12.8468 128.055 12.849C126.682 12.849 125.673 11.9903 125.673 10.7001C125.673 9.40994 126.704 8.55128 128.055 8.55128C128.751 8.552 129.431 8.76135 130.007 9.15236V5.58564C129.221 5.21826 128.364 5.02741 127.497 5.02643C124.108 5.02643 121.704 7.41082 121.704 10.7001V10.7001ZM138.266 12.4416C138.069 12.729 137.802 12.9609 137.491 13.1151C137.179 13.2693 136.833 13.3407 136.486 13.3223C135.457 13.3223 134.62 12.6618 134.556 11.6887H141.958C141.986 11.4173 142 11.1447 142 10.8719C142 7.34918 139.725 5.02643 136.422 5.02643C135.671 5.01146 134.925 5.14853 134.229 5.42946C133.532 5.7104 132.899 6.12941 132.368 6.66132C131.837 7.19323 131.419 7.82709 131.139 8.52489C130.858 9.2227 130.722 9.97007 130.736 10.7222C130.736 14.1391 132.967 16.3738 136.464 16.3738C138.824 16.3738 140.584 15.4711 141.613 13.7318L138.266 12.4416ZM134.576 9.45399C134.662 8.57332 135.413 7.99208 136.4 7.99208C137.387 7.99208 138.116 8.57332 138.202 9.45399H134.576Z"
        fill="var(--yb-finance-logo-property, #232A31)"
      ></path>
    </svg>
  );
};
