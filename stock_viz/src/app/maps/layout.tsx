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
      <div className="flex flex-row w-full">
        <div className="w-[20%]">
          <MapsSideBar />
        </div>
        <div className="w-[80%]">{children}</div>

      </div>
    </div>
  );
}
