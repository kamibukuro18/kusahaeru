import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'

interface Contributions {
  [key: string]: number
}

const XContributionGraph: React.FC = () => {
  const [account, setAccount] = useState<string>('')
  const [contributions, setContributions] = useState<Contributions>({})
  const [loading, setLoading] = useState<boolean>(false)

  const getColor = useCallback((count: number): string => {
    if (count === 0) return 'bg-gray-100'
    if (count < 5) return 'bg-green-200'
    if (count < 10) return 'bg-green-300'
    if (count < 15) return 'bg-green-400'
    return 'bg-green-500'
  }, [])

  const fetchData = useCallback(async (inputAccount: string) => {
    setLoading(true)
    try {
      const response = await axios.get<Contributions>(`/api/x-data?account=${inputAccount}`)
      setContributions(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      // エラーハンドリングを追加（例：ユーザーへの通知）
    }
    setLoading(false)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (account.trim()) {
      fetchData(account)
    }
  }, [account, fetchData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(e.target.value)
  }

  useEffect(() => {
    fetchData('')  // 初期データ読み込み
  }, [fetchData])

  const renderDays = useCallback(() => {
    return Object.entries(contributions).map(([day, count]) => (
      <div
        key={day}
        className={`w-3 h-3 ${getColor(count)} rounded-sm`}
        title={`Posts: ${count}`}
      />
    ))
  }, [contributions, getColor])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="flex mb-6">
        <input
          type="text"
          value={account}
          onChange={handleInputChange}
          placeholder="Enter X account"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Fetch Data
        </button>
      </form>
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-end space-x-2 text-xs text-gray-600 mb-1">
            <span>Less</span>
            <div className="flex space-x-1">
              {['bg-gray-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'].map((color) => (
                <div key={color} className={`w-3 h-3 ${color} rounded-sm`} />
              ))}
            </div>
            <span>More</span>
          </div>
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  )
}

export default XContributionGraph