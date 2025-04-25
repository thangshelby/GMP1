import MapsHeader from "./@mapsheader/page";
import MapsSideBar from "./@mapssidebar/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Market Maps",
  description: "",
};

export default function MapsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-1">
      <MapsHeader />
      <div className="flex w-full flex-row">
        <div className="w-[15%]">
          <MapsSideBar />
        </div>
        <div className="w-[85%]">{children}</div>
      </div>
    </div>
  );
}
