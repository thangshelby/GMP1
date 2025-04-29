import { useMemo} from "react";
import { useDebounce } from "./useDebounce";

export function useSearch(data, query, ...filters) {
    const debouncedQuery =useDebounce(query, 300);

    const searchResults = useMemo(() => {
        const dataArray = Array.isArray(data) ? data : [data];

        try {
            // Apply each filter function in sequence
            return filters.reduce(
                (acc, feature) => feature(acc, debouncedQuery),
                dataArray
            );
        } catch (error) {
            console.error("Error applying search features:", error);
            return dataArray;
        }
    }, [data, debouncedQuery, filters]);

    return searchResults;
}


