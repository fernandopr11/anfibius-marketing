import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import {Toaster} from 'sonner';

interface AdminLayoutWrapperProps {
    children: React.ReactNode;
    title: string;
}

export default function AdminLayoutWrapper({children, title}: AdminLayoutWrapperProps) {
    return (
        <SidebarProvider>
            <Toaster position="top-right" richColors/>
            <div className="flex min-h-screen w-full">
                <AppSidebar/>
                <div className="flex-1 flex flex-col">
                    <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center gap-4">
                        <SidebarTrigger/>
                        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    </header>
                    <main className="flex-1 p-8 bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}