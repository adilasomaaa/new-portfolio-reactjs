
import { Outlet } from 'react-router-dom'

const BlogLayout = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default BlogLayout