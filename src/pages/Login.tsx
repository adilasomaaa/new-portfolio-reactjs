import React, { useEffect, useState } from 'react'
import { Button, Input } from '../components/common'
import { Navigate, useNavigate } from 'react-router-dom';
import { signIn } from '@/services/authService';
import Message from '@/components/common/Message';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/config/firebase';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: any) => {
            setCurrentUser(user); // Set user jika ada, atau null jika tidak
            setLoading(false); // Selesai loading setelah pengecekan selesai
        });

        // Membersihkan listener saat komponen tidak lagi digunakan
        return () => unsubscribe();
    }, []);

    
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn(username, password);
            setMessage({ text: 'Login successful!', type: 'success' });
            navigate('/dashboard'); // Arahkan ke halaman dashboard setelah login berhasil
            setLoading(false);
        }catch(error) {
            console.error('Login error:', error);
            setMessage({ text: 'Login failed. Please check your credentials and try again.', type: 'error' });
            setLoading(false);
        }
    }

    if (currentUser) {
        // Jika ada pengguna, arahkan ke dashboard
        return <Navigate to="/dashboard" replace />;
    }
  return (
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full md:w-[400px] flex flex-col items-center">
                <h2 className="text-4xl font-semibold mb-4">Stay in the Loop</h2>
                <h2 className="text-4xl mb-8">Sign In Now</h2>
                    <form onSubmit={handleLogin} className='w-full'>
                        {message &&
                            <Message
                                message={message.text}
                                type={message.type}
                                onClose={() => setMessage(null)}
                                className="mb-4" // Contoh menambah kelas custom
                            />
                        }
                        <div className="mb-4">
                            <Input
                                label="Username"
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => {setUsername(e.target.value)}}
                                placeholder="Enter your username"/>
                        </div>
                        <div className="mb-6">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value)}}
                                placeholder="Enter your Password"/>
                        </div>
                        <div className="flex items-center justify-between">
                            <Button type="submit" className='text-white w-full' disabled={loading}>
                                { loading ? `Loading...` : `Sign In`}
                            </Button>
                        </div>
                    </form>
            </div>
        </div>

    </>
  )
}

export default Login