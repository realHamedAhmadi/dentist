import { useInfiniteQuery } from "@tanstack/react-query";

export type SelectOption = {
    id: number | string;
    label: string;
    description?: string; // optional description
};

export function useEnterpriseOptions(
    search: string,
    fetchFn: (
        search: string,
        page: number,
        signal: AbortSignal
    ) => Promise<{
        data: SelectOption[];
        currentPage: number;
        lastPage: number;
    }>
) {
    return useInfiniteQuery({
        queryKey: ["enterprise-select", search],

        // Fetch options from server
        queryFn: async ({ pageParam = 1, signal }) => {
            return fetchFn(search, pageParam, signal);
        },

        // Pagination logic
        getNextPageParam: (lastPage) =>
            lastPage.currentPage < lastPage.lastPage
                ? lastPage.currentPage + 1
                : undefined,

        suspense: true,

        // Cache options for 5 minutes
        staleTime: 1000 * 60 * 5,
    });
}
