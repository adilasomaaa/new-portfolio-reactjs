import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full md:w-[400px] flex flex-col items-center">
                <h2 className="text-4xl font-semibold mb-4">Something went wrong!</h2>
                <h2 className="text-4xl mb-8">404 Data not found</h2>
                <Link to={'/dashboard'} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Back to Home</Link>
            </div>
        </div>
  )
}

export default NotFoundPage