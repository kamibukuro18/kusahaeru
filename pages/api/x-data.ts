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

  if (!account || typeof account !== 'string') {
    return res.status(400).json({ error: 'Account is required and must be a string' })
  }

  if (account.trim() === '') {
    return res.status(400).json({ error: 'Account cannot be empty' })
  }

  const bearerToken = process.env.X_BEARER_TOKEN
  if (!bearerToken) {
    console.error('X_BEARER_TOKEN is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    console.log('Fetching data for account:', account)
    const apiUrl = `https://api.twitter.com/2/users/by/username/${account}`

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      }
    })

    console.log('X API response:', response.data)

    // この部分は実際のAPIレスポンスに基づいて調整する必要があります
    const contributions: Contributions = {}
    const today = new Date()
    for (let i = 0; i < 357; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      contributions[dateString] = Math.floor(Math.random() * 10)
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