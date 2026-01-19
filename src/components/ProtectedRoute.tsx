import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '@/config/firebase'; // Impor auth
import { onAuthStateChanged } from 'firebase/auth';
import ArticleSkeleton from './common/ArticleSkeleton';


const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener ini akan berjalan saat komponen dimuat & saat auth berubah
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Membersihkan listener saat komponen di-unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        {[...Array(3)].map((_, index) => (
          <ArticleSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Jika ada user, tampilkan halaman (Outlet). Jika tidak, arahkan ke login.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;