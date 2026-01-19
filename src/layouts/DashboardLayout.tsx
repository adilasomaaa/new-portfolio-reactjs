import Sidebar from '../components/dashboard/Sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/dashboard/Navbar'

const DashboardLayout = () => {
  return (
    <div className='mx-auto sm:px-12 lg:px-24 px-6 py-4'>
        <Navbar/>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
            <div className='sm:col-span-1 md:col-span-2 lg:col-span-3 row-span-5'>
                <Sidebar/>
            </div>
            <div className="sm:col-span-1 md:col-span-6 lg:col-span-9 row-span-5 px-0 md:px-4">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default DashboardLayout