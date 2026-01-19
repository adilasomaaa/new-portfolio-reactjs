import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
const LandingLayout = () => {
  return (
    <>
      <div className='bg-paper text-ink relative font-sans min-h-screen' id='background'>
            <Navbar/>
            <div className="container mx-auto sm:px-12 lg:px-24 px-6">
                <Outlet/>
            </div>
            <Footer/>
      </div>
    </>
  )
}

export default LandingLayout