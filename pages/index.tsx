import type { NextPage } from 'next'
import Layout from '@components/Layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <main className="">
        <h1 className="">Relink your Notion pages easily</h1>

        <p className="">
          You import two <code>.csv</code> files into Notion and need to
          recreate a Relation type column based on data you already have.
          <br />
          Transforming the column in type Relation does not work. This tool will
          help. Get your two tables, tell which column should be link and wait
          for it.
        </p>
      </main>
    </Layout>
  )
}

export default Home
