import { useEffect, useState } from 'react'
import { Button, Card } from '@/components/common'
import { getAllArticles } from '@/services/articleService'
import { Link } from 'react-router-dom'
import ArticleSkeleton from '@/components/common/ArticleSkeleton'

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([])
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const articlesData : any = await getAllArticles()
        setArticles(articlesData);
        setLoading(false);
      }catch(error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }finally {
        setLoading(false);
      }
    }
    
    fetchArticles();
  }, [])
      
  return (
    <>
    <div className="flex justify-between items-center">
        <div>
            <div id="projects" className='text-xl sm:text-2xl lg:text-[44px] font-light text-left'>Manage Blog</div>
            <p className='text-gray-600 '>You can manage your blog here</p>
        </div>
        <div>
            <Link to={"/dashboard/blog/create"}>
              <Button className='text-white'>Add</Button>
            </Link>
        </div>
    </div>
    <div className="mt-6">
        <div className="grid grid-cols-1 gap-4">
            {!loading ? articles.map((post: any) => (
                <Card key={post.id}>
                  <div className="flex justify-between">
                    <h2 className="text-2xl mb-2">{post.title}</h2>
                    <span className="text-sm text-gray-500">{post.date.toDate().toLocaleDateString('id-ID')} - {post.views} views</span>
                  </div>
                  <Link to={`/dashboard/blog/edit/${post.id}`} className="text-blue-500 hover:underline">Edit</Link>
                  <Link to={`/blog/${post.slug}`} className="mx-3 text-blue-500 hover:underline">Show</Link>
                  <Link to={`/dashboard/blog/edit/${post.id}`} className="text-blue-500 hover:underline">Delete</Link>
                </Card>
              )) : (
                <div className="p-4 w-full">
                  {[...Array(3)].map((_, index) => (
                    <ArticleSkeleton key={index} />
                  ))}
                </div>
              )}
        </div>
    </div>
    </>
  )
}

export default Blog