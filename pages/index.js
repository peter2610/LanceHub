import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>LanceHub - Vector Database UI</title>
        <meta name="description" content="Modern UI for LanceDB" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Welcome to LanceHub
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-700">
            Your Next.js frontend for LanceDB is ready! Start building your application by editing{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">pages/index.js</code>
          </p>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} LanceHub - Powered by Next.js and LanceDB</p>
      </footer>
    </div>
  )
}
