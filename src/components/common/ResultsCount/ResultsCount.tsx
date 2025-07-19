interface ResultsCountProps {
  total: number;
  filtered: number;
  isLoading: boolean;
  itemType: "movies" | "series";
}

export default function ResultsCount({ total, filtered, isLoading, itemType }: ResultsCountProps) {
  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
        <div className="animate-pulse h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (filtered === total) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing all <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span> {itemType}
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Showing <span className="font-medium text-gray-700 dark:text-gray-300">{filtered}</span> of{" "}
      <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span> {itemType}
    </div>
  );
}
