import React, { useState, useCallback } from 'react'
import axios from 'axios'

interface Tweet {
  id: string;
  text: string;
}

interface TweetsResponse {
  data: Tweet[];
}

const XContributionGraph: React.FC = () => {
  const [username, setUsername] = useState<string>('')
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (inputUsername: string) => {
    if (!inputUsername.trim()) {
      setError('Please enter a valid username')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<TweetsResponse>(`/api/x-data?username=${inputUsername}`)
      console.log('API response:', response.data)
      setTweets(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch tweets. Please try again.')
    }
    setLoading(false)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username.trim()) {
      fetchData(username.trim())
    } else {
      setError('Please enter a valid username')
    }
  }, [username, fetchData])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="flex mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter X username (without @)"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Fetch Tweets
        </button>
      </form>
      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && tweets.length > 0 && (
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4">Recent Tweets</h2>
          {tweets.map(tweet => (
            <div key={tweet.id} className="mb-4 p-4 border rounded">
              <p>{tweet.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default XContributionGraph