import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface UserData {
  id: string;
  name: string;
  username: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserData | { error: string }>
) {
  const { account } = req.query

  if (!account || typeof account !== 'string') {
    return res.status(400).json({ error: 'Account is required' })
  }

  const bearerToken = process.env.X_BEARER_TOKEN
  if (!bearerToken) {
    console.error('X_BEARER_TOKEN is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const apiUrl = `https://api.twitter.com/2/users/me`
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      }
    })

    console.log('X API response:', response.data)

    if (response.data.errors) {
      return res.status(400).json({ error: response.data.errors[0].message })
    }

    const userData = response.data.data
    if (!userData) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(userData)
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