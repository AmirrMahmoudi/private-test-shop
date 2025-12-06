'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AuthWrapper from '@/components/AuthWrapper';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <AuthWrapper>
            {isLoginPage ? (
                children
            ) : (
                <div className="flex h-screen overflow-hidden bg-background">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            )}
        </AuthWrapper>
    );
}
