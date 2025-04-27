import { NodeType } from "@/types";

export const paddingOuter = 1;
export const paddingTop = 16;
export const fontSize = paddingTop - 4;

export const handleTextFontSizeSymbol = (symbol: NodeType) => {
   const boxWidth = symbol.x1 - symbol.x0;
   const boxHeight = symbol.y1 - symbol.y0;

  if (boxHeight < 15 || boxWidth < 20) return "0";
  if (boxHeight < 20 || boxWidth < 25) return "5";
  if (boxHeight < 25 || boxWidth < 30) return "6";
  if (boxHeight < 30 || boxWidth < 35) return "8";
  if (boxHeight < 35 || boxWidth < 40) return "10";
  if (boxHeight < 40 || boxWidth < 45) return "12";
  if (boxHeight < 45 || boxWidth < 50) return "14";
  if (boxHeight < 50 || boxWidth < 55) return "16";
  if (boxHeight < 55 || boxWidth < 60) return "18";
  return "20";
};

export const handleTextIndustry = (parent: NodeType) => {
  const boxWidth = parent.x1 - parent.x0;
  if (boxWidth <= 10) return "";

  if (parent.data.name.length*12 < boxWidth*1.5) {
    return parent.data.name
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase())
      .join("");
  }

  return parent.data.name
    .split(" ")
    .slice(0, 2)
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim()
    .toLocaleUpperCase();
};

export const handleFontSizeIndustry = (industry: NodeType) => {
  const boxWidth = industry.x1 - industry.x0;
  if (handleTextIndustry(industry).length * 12 > boxWidth * 1.5) {
    return "0";
  }
  return "12";
};