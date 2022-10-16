import { useState, useEffect } from 'react'

const useSearchHistory = () => {
    const [queries, setQueries] = useState();
    const searchHistory = typeof window !== 'undefined' && localStorage.getItem('searchHistory');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const queries = searchHistory && JSON.parse(searchHistory) || [];
            setQueries(queries);
        }
    }, [searchHistory])

    return {
        queries
    }
}

export default useSearchHistory;