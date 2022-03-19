import Layout from '@components/Layout'
import useSwr from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Relink() {
  const { data,error } = useSwr('/api/notion/list-pages', fetcher)

  console.log(data);

  return (
    <Layout>
      <h1>Relink pages</h1>
      {error && <p>Failed to load</p>}
      {data && <p>There are {data.pages.length} pages</p>}
    </Layout>
  )
}
