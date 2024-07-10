import type { NextPage } from 'next'
import Head from 'next/head'
import XContributionGraph from '../components/XContributionGraph'

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <Head>
        <title>X Contribution Graph</title>
        <meta name="description" content="View X contribution graph" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-8 text-center">
          X Contribution Graph
        </h1>
        <XContributionGraph />
      </main>
    </div>
  )
}

export default Home