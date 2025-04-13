/**
 * Abstracts the boilerplate and makes API calls more elegant.
 *
 * @param url - The URL to fetch data from
 * @returns Object containing:
 *  - data: The fetched data of type T or null
 *  - loading: Boolean indicating if fetch is in progress
 *  - error: Error object if fetch fails, null otherwise
 *
 * @example
 * interface User {
 *   id: number
 *   name: string
 *   email: string
 * }
 *
 * function UserProfile() {
 *   const { data, loading, error } = useFetch<User[]>('/api/users')
 *
 *   if (loading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *   if (!data) return <p>No data found</p>
 *
 *   return <ul>{data?.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
 */

import { useEffect, useState } from 'react'

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url)
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export default useFetch
