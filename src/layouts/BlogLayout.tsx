
import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const BlogLayout = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Adi's Journal</title>
        <meta name="description" content="Engineering, design, and stories by Adi." />
      </Helmet>
      <main className="container mx-auto py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default BlogLayout