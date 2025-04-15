import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-between p-12 bg-[#14161d]">
      <div className="flex flex-row ">
        {footerCategories.map((category,index) => (
          <div
            key={category}
            className="text-primary hover:text-primary text-xs  font-medium hover:cursor-pointer hover:underline flex flex-row items-center "
          >
            {category}
            {index!== footerCategories.length - 1 && (
              <div className="w-1 h-1  bg-primary rounded-full opacity-20 mx-2">
                </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-secondary text-sm font-medium">© 2023 StockViz</div>
    </div>
  );
};

export default Footer;

const footerCategories = [
  "Affiliate Program",
  "Privacy Policy",
  "Terms of Service",
  "Risk Warning",
  "Themes Settings",
  "Help Center",
];
