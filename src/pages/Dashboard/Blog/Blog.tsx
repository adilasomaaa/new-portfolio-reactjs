import { useEffect, useState } from 'react'
import { Button, Card } from '@/components/common'
import { getAllArticles, deleteArticle } from '@/services/articleService'
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

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
        try {
            await deleteArticle(id);
            setArticles(articles.filter((article: any) => article.id !== id));
            // Optional: Show success message if you have a toast component
        } catch (error) {
            console.error("Failed to delete article", error);
            alert("Failed to delete article");
        }
    }
  }
      
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
                  <div className="flex justify-between items-baseline mb-4 border-b border-black pb-2">
                    <h2 className="text-2xl font-serif font-bold">{post.title}</h2>
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-500">{post.date?.toDate().toLocaleDateString('id-ID')} — {post.views} views</span>
                  </div>
                  <div className="flex gap-4 font-mono text-sm uppercase tracking-wide">
                      <Link to={`/dashboard/blog/edit/${post.id}`} className="text-black hover:underline decoration-2">Edit</Link>
                      <Link to={`/blog/${post.slug}`} className="text-black hover:underline decoration-2">Show</Link>
                      <button onClick={() => handleDelete(post.id, post.title)} className="text-red-600 hover:text-red-800 hover:underline decoration-2 cursor-pointer bg-transparent border-none p-0 uppercase font-mono text-sm">Delete</button>
                  </div>
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