import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface Contributions {
  [key: string]: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Contributions | { error: string }>
) {
  const { account } = req.query

  if (!account || typeof account !== 'string') {
    return res.status(400).json({ error: 'Account is required' })
  }

  try {
    // X APIのエンドポイント（実際のエンドポイントに置き換えてください）
    const apiUrl = `https://api.twitter.com/2/users/by/username/${account}`

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.X_BEARER_TOKEN}`,
      }
    })

    // ここでは、APIレスポンスから投稿データを取得し、Contributions形式に変換する必要があります
    // 以下は仮のロジックです。実際のAPIレスポンス構造に合わせて調整してください。
    const contributions: Contributions = {}
    const today = new Date()
    for (let i = 0; i < 357; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      contributions[dateString] = Math.floor(Math.random() * 10) // この行を実際のデータ取得ロジックに置き換えてください
    }

    res.status(200).json(contributions)
  } catch (error) {
    console.error('Error fetching X data:', error)
    res.status(500).json({ error: 'Failed to fetch data from X API' })
  }
}