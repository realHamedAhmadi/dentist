import { useState, useCallback, useRef } from "react";

/**
 * usePaginatedFetch
 * Handles pagination state (page, items) and UI-related flags (loading, error).
 * Adapted to work with an API response structure containing 'data', 'meta', and 'links'.
 *
 * Expected API Response Shape:
 * {
 *   data: [...items],
 *   meta: {
 *     current_page: number,
 *     last_page: number,
 *     per_page: number,
 *     total: number,
 *     // ... other meta data ...
 *   },
 *   links: {
 *     prev: string | null,
 *     next: string | null
 *   }
 * }
 *
 * apiCallFn signature:
 *   apiCallFn(page, itemsPerPage) -> Promise<{ data, meta, links }>
 */
export default function usePaginatedFetch(apiCallFn, options = {}) {
    const {
        initialPage = 1,
        // itemsPerPage is now primarily derived from API response meta if available
        itemsPerPage=15
    } = options;

    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [hasNextPage, setHasNextPage] = useState(false); // Default to false, will be updated by API response
    const [lastPage, setLastPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(itemsPerPage); // Default, can be updated

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isFetchingRef = useRef(false);
    const responseLinksRef = useRef({}); // To store the actual links object from response

    const fetchPage = useCallback(
        async (pageToLoad) => {
            if (isFetchingRef.current) return;
            if (!Number.isFinite(pageToLoad) || pageToLoad < 1) {
                // If trying to go to a page less than 1, reset state and return
                if (pageToLoad < 1) {
                    reset(); // Or handle as appropriate
                }
                return;
            }

            isFetchingRef.current = true;
            setIsLoading(true);
            setError(null);

            try {
                // We pass the page number, and assume the API handles itemsPerPage
                // or derives it from meta/config. We'll update perPage from response if available.
                const response = await apiCallFn(pageToLoad, perPage); // Pass current perPage

                const data = response?.data ?? [];
                const meta = response?.meta ?? {};
                const links = response?.links ?? {};

                setItems(data);
                setCurrentPage(meta.current_page ?? pageToLoad);
                setLastPage(meta.last_page ?? initialPage);
                // Update perPage from response meta if it exists and is valid
                if (meta.per_page && Number.isFinite(meta.per_page)) {
                    setPerPage(meta.per_page);
                }

                // Determine hasNextPage from the 'next' link or last_page meta
                setHasNextPage(!!links.next || (meta.current_page && meta.last_page && meta.current_page < meta.last_page));

                responseLinksRef.current = links; // Store links for potential direct URL usage if needed

            } catch (err) {
                setError(err?.message || "An unknown error occurred.");
                setItems([]); // Clear items on error
                setHasNextPage(false);
                setCurrentPage(initialPage);
                setLastPage(initialPage);
            } finally {
                isFetchingRef.current = false;
                setIsLoading(false);
            }
        },
        [apiCallFn, perPage, initialPage, reset] // Added reset to dependencies
    );

    // Function to go to a specific page number
    const goToPage = useCallback((pageNumber) => {
        if (isLoading || !Number.isFinite(pageNumber) || pageNumber < 1 || pageNumber > lastPage) return;
        fetchPage(pageNumber);
    }, [isLoading, lastPage, fetchPage]);

    const goToNextPage = useCallback(() => {
        // Use the stored links object if available, otherwise fallback to calculation
        const nextPageUrl = responseLinksRef.current?.next;
        if (isLoading || !hasNextPage) return;

        // If API provides explicit 'next' URL, we could potentially use it directly
        // For simplicity, we'll stick to page number calculation based on current logic
        if (nextPageUrl) {
            // Advanced: could parse nextPageUrl to get the page number, but fetchPage(currentPage + 1) is simpler if API is consistent
            fetchPage(currentPage + 1);
        } else {
            // Fallback if no 'next' link but hasNextPage is true (e.g., calculated from last_page)
            fetchPage(currentPage + 1);
        }
    }, [isLoading, hasNextPage, fetchPage, currentPage]);

    const goToPrevPage = useCallback(() => {
        const prevPageUrl = responseLinksRef.current?.prev;
        if (isLoading || currentPage <= 1) return;

        if (prevPageUrl) {
            // Similar to goToNextPage, simpler to use page number calculation
            fetchPage(currentPage - 1);
        } else {
            fetchPage(currentPage - 1);
        }
    }, [isLoading, currentPage, fetchPage]);

    const reload = useCallback(() => {
        fetchPage(currentPage);
    }, [fetchPage, currentPage]);

    const reset = useCallback(() => {
        setItems([]);
        setCurrentPage(initialPage);
        setHasNextPage(false);
        setLastPage(initialPage);
        setPerPage(itemsPerPage); // Reset to initial/default perPage
        setIsLoading(false);
        setError(null);
        isFetchingRef.current = false;
        responseLinksRef.current = {};
    }, [initialPage, itemsPerPage]); // Added options.itemsPerPage to deps

    return {
        items,
        isLoading,
        error,
        currentPage,
        hasNextPage,
        lastPage,       // Expose lastPage
        perPage,        // Expose perPage
        goToPage,       // Function to go to a specific page
        goToNextPage,
        goToPrevPage,
        reload,
        reset,
    };
}
