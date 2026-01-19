import { Button } from '../common'
import { logOut } from '@/services/authService'

const Navbar = () => {
    const signOut = () => {
      try {
        logOut()
      }catch(error) {
        console.error("Error logging out:", error);
      }
    }
  return (
    <div className='bg-blue-600 py-4 px-8 rounded-lg text-white flex justify-between items-center mb-6'>
        Hello, Boss!
        <Button onClick={() => signOut()}>Logout</Button>
    </div>
  )
}

export default Navbar