import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'

interface Contributions {
  [key: string]: number
}

const XContributionGraph: React.FC = () => {
  // ... (既存のコード)

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

  // ... (残りのコード)
}

export default XContributionGraph