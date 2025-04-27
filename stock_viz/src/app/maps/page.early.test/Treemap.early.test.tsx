import React from "react";
import { useQuery } from "@tanstack/react-query";
import { render } from "@testing-library/react";

// Import Treemap directly from components instead of page
import Treemap from "@/components/home/TreeMap";

// Mocking the components and hooks
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn().mockImplementation(key => {
      if (key === "exchange") return "top_500";
      if (key === "timeframe") return "1Y";
      return null;
    })
  })),
}));

// Add display names to mock components
const IndustryHoverCardMock = () => (<div>IndustryHoverCard</div>);
IndustryHoverCardMock.displayName = "IndustryHoverCardMock";

const LoadingMock = () => <div>LoadingTable</div>;
LoadingMock.displayName = "LoadingMock";

jest.mock("@/components/maps/IndustryHoverCard", () => IndustryHoverCardMock);
jest.mock("@/components/ui/Loading", () => LoadingMock);

// Mock Link component
jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

describe("Treemap component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render the loading state when data is being fetched", () => {
      // Mocking useQuery to simulate loading state
      (useQuery as jest.Mock).mockReturnValue({
        isLoading: true,
        data: null,
        isError: false,
      });

      const { getByText } = render(<Treemap />);

      // Expect the loading component to be rendered
      expect(getByText("LoadingTable")).toBeTruthy();
    });

    it("should render the treemap with data", () => {
      // Mocking useQuery to simulate data fetching
      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        data: [
          {
            sector: "Tech",
            industry: "Software",
            symbol: "AAPL",
            market_cap: 1000,
            change: 1.5,
          },
        ],
        isError: false,
      });

      const { container } = render(<Treemap />);

      // We should test for SVG elements
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle error state gracefully", () => {
      // Mocking useQuery to simulate error state
      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        data: null,
        isError: true,
      });

      const { queryByText } = render(<Treemap />);

      // In error state, it should not render the loading component
      expect(queryByText("LoadingTable")).toBeNull();
    });

    it("should handle empty data gracefully", () => {
      // Mocking useQuery to simulate empty data
      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        data: [],
        isError: false,
      });

      const { queryByText } = render(<Treemap />);

      // In empty data state, it should not render the loading component
      expect(queryByText("LoadingTable")).toBeNull();
    });
  });
});
