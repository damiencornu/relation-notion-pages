import Head from 'next/head'
import Header from '@components/Header'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen py-0 px-2 flex flex-col justify-center align-center">
    <Head>
      <title>Relink Notion Pages</title>
      <meta
        name="description"
        content="Recreate relation between Notion pages after csv imports"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />

    <main className="flex-1">{children}</main>

    <footer>
      <p>
        Found a bug? This tool is open-sourced on{' '}
        <a
          href="https://github.com/damiencornu/relation-notion-pages"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </p>
    </footer>
  </div>
)

export default Layout
