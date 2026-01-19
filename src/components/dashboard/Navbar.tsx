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
    <div className='py-4 mb-4 flex justify-between items-center border-b-2 border-black'>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
            <span className="font-mono text-sm uppercase tracking-wider hidden sm:inline-block">Welcome, Admin</span>
            <Button onClick={() => signOut()} className="bg-transparent text-black border border-black hover:bg-black hover:text-white rounded-none uppercase font-mono text-xs">Logout</Button>
        </div>
    </div>
  )
}

export default Navbar