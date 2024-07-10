import React, { useState, useCallback } from 'react'
import axios from 'axios'

interface Contributions {
  [key: string]: number
}

interface ErrorResponse {
  error: string
}

const XContributionGraph: React.FC = () => {
  const [account, setAccount] = useState<string>('')
  const [contributions, setContributions] = useState<Contributions>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (inputAccount: string) => {
    if (!inputAccount.trim()) {
      setError('Please enter a valid account name')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<Contributions | ErrorResponse>(`/api/x-data`, {
        params: { account: inputAccount }
      })
      console.log('API response:', response.data)
      if ('error' in response.data) {
        setError(response.data.error)
      } else {
        setContributions(response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch data. Please try again.')
    }
    setLoading(false)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (account.trim()) {
      fetchData(account.trim())
    } else {
      setError('Please enter a valid account name')
    }
  }, [account, fetchData])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="flex mb-6">
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Enter X username (without @)"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Fetch Data
        </button>
      </form>
      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && Object.keys(contributions).length > 0 && (
        <div className="flex flex-col">
          {/* レンダリングロジックをここに追加 */}
        </div>
      )}
    </div>
  )
}

export default XContributionGraph