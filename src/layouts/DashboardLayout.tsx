import Sidebar from '../components/dashboard/Sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/dashboard/Navbar'

const DashboardLayout = () => {
  return (
    <div className='bg-paper text-ink font-sans min-h-screen'>
    <div className='mx-auto sm:px-12 lg:px-24 px-6 py-4'>
        <Navbar/>
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-8 border-t border-black pt-8">
            <div className='col-span-1 md:col-span-2 lg:col-span-3 border-b md:border-b-0 md:border-r border-black pb-8 md:pb-0 md:pr-8 md:min-h-[80vh]'>
                <Sidebar/>
            </div>
            <div className="col-span-1 md:col-span-6 lg:col-span-9 px-0 md:px-4">
                <Outlet/>
            </div>
        </div>
    </div>
    </div>
  )
}

export default DashboardLayout