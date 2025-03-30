import { create } from "zustand";
import {
  StockPriceDataType,
  FinancialDataType,
  BusinessDataType,
} from "@/types";

interface GlobalStateType {
  chartContainerWidth: number;
  chartContainerHeight: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  setGlobalState: (state: Partial<GlobalStateType>) => void;
}

export const useGlobalState = create<GlobalStateType>((set) => ({
  chartContainerWidth: 0,
  chartContainerHeight: 0,
  paddingTop: 50,
  paddingBottom: 30,
  paddingLeft: 30,
  paddingRight: 30,

  setGlobalState: (newValue: any) => set((prev) => ({ ...prev, ...newValue })),
}));

interface PdfStore {
  financialData: FinancialDataType;
  setFinancialData: (newVal: FinancialDataType) => void;
  businessData: BusinessDataType;
  setBusinessData: (newVal: BusinessDataType) => void;
  canCreatePdf: boolean;
  setCanCreatePdf: (newVal: boolean) => void;
}

export const usePdfStore = create<PdfStore>((set) => ({
  financialData: {} as FinancialDataType,
  setFinancialData: (newVal: FinancialDataType) =>
    set({ financialData: newVal }),
  businessData: {} as BusinessDataType,
  setBusinessData: (newVal: BusinessDataType) => set({ businessData: newVal }),
  canCreatePdf: false,
  setCanCreatePdf: (newVal: boolean) => set({ canCreatePdf: newVal }),
}));

interface ChartControlStore {
  selectedIndicators: string[];
  setSelectedIndicators: (newVal: string[]) => void;
  selectedChart: number;
  setSelectedChart: (newVal: number) => void;
  currentStockPriceData: StockPriceDataType;
  setCurrentStockPriceData: (newVal: StockPriceDataType) => void;
  interval: string;
  setInterval: (newVal: string) => void;
}

export const useChartControlStore = create<ChartControlStore>((set) => ({
  selectedIndicators: [],
  setSelectedIndicators: (newVal: string[]) =>
    set({ selectedIndicators: newVal }),
  selectedChart: 0,
  setSelectedChart: (newVal: number) => set({ selectedChart: newVal }),
  currentStockPriceData: {} as StockPriceDataType,
  setCurrentStockPriceData: (newVal: StockPriceDataType) =>
    set({ currentStockPriceData: newVal }),
  interval: "1D",
  setInterval: (newVal: string) => set({ interval: newVal }),
}));
