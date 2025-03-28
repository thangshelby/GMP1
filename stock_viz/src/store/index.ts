import { create } from "zustand";
import { StockPriceDataType } from "@/types";

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

interface CanCreatePdfStore {
  canCreatePdf: boolean;
  setCanCreatePdf: (newVal: boolean) => void;
}

export const useCanCreatePdfStore = create<CanCreatePdfStore>((set) => ({
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

