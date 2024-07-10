import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface Contributions {
  [key: string]: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Contributions | { error: string }>
) {
  console.log('API route called with query:', req.query)

  const { account } = req.query

  if (!account || typeof account !== 'string' || account.trim() === '') {
    return res.status(400).json({ error: 'Valid account name is required' })
  }

  const bearerToken = process.env.X_BEARER_TOKEN
  if (!bearerToken) {
    console.error('X_BEARER_TOKEN is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const apiUrl = `https://api.twitter.com/2/users/by/username/${account}`
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
      params: {
        'user.fields': 'public_metrics,created_at'
      }
    })

    console.log('X API response:', response.data)

    const userData = response.data.data
    if (!userData) {
      return res.status(404).json({ error: 'User not found' })
    }

    // この部分は実際のデータに基づいて調整する必要があります
    const contributions: Contributions = {}
    const today = new Date()
    const createdAt = new Date(userData.created_at)
    const daysSinceCreation = Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

    for (let i = 0; i < Math.min(357, daysSinceCreation); i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      // この行を実際のデータ取得ロジックに置き換える必要があります
      contributions[dateString] = Math.floor(userData.public_metrics.tweet_count / daysSinceCreation)
    }

    res.status(200).json(contributions)
  } catch (error) {
    console.error('Error fetching X data:', error)
    if (axios.isAxiosError(error) && error.response) {
      console.error('X API error response:', error.response.data)
      res.status(error.response.status).json({ error: `X API error: ${error.response.data.detail || 'Unknown error'}` })
    } else {
      res.status(500).json({ error: 'Failed to fetch data from X API' })
    }
  }
}