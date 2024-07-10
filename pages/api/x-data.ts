import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface Tweet {
  id: string;
  text: string;
}

interface UserData {
  id: string;
  name: string;
  username: string;
}

interface TweetsResponse {
  data: Tweet[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetsResponse | { error: string }>
) {
  const { username } = req.query

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' })
  }

  const bearerToken = process.env.X_BEARER_TOKEN
  if (!bearerToken) {
    console.error('X_BEARER_TOKEN is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    // ユーザーIDの取得
    const userUrl = `https://api.twitter.com/2/users/by/username/${username}`
    const userResponse = await axios.get<{ data: UserData }>(userUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      }
    })

    const userId = userResponse.data.data.id

    // ツイートリストの取得
    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets`
    const tweetsResponse = await axios.get<TweetsResponse>(tweetsUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      }
    })

    console.log('X API response:', tweetsResponse.data)

    res.status(200).json(tweetsResponse.data)
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