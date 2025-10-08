import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export default function ProtectedRoute({
                                           children,
                                           redirectTo = '/auth/login'
                                       }: ProtectedRouteProps) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Verificar autenticación
        if (!storage.isAuthenticated()) {
            window.location.href = redirectTo;
        } else {
            setIsAuthorized(true);
        }
        setIsChecking(false);
    }, [redirectTo]);

    if (isChecking || !isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005873] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verificando acceso...</p>
                </div>
            </div>
        );
    }
    return <>{children}</>;
}