export default function LoadingTable({
  tableHeight = 350,
  tableWidth = 1000,
}: {
  tableHeight?: number;
  tableWidth?: number;
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: tableHeight, width: tableWidth }}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );
}

