import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface Contributions {
  [key: string]: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Contributions>
) {
  const { account } = req.query

  // この部分は実際のXのAPIを呼び出す処理に置き換える必要があります
  const mockData: Contributions = {}
  for (let i = 0; i < 357; i++) {
    mockData[`day-${i}`] = Math.floor(Math.random() * 20)
  }

  res.status(200).json(mockData)
}