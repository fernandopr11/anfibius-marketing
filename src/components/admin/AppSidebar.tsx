// src/components/admin/AppSidebar.tsx
import {useEffect, useState} from 'react';
import {storage} from '@/lib/storage';
import type {User} from '@/types/auth.types';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    FileText,
    FolderOpen,
    Users,
    UserCheck,
    User as UserIcon,
    LogOut,
    Home,
} from 'lucide-react';

export default function AppSidebar() {
    const [user, setUser] = useState<User | null>(null);
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        const userData = storage.getUser();
        setUser(userData);
        setCurrentPath(window.location.pathname);
    }, []);

    const handleLogout = () => {
        storage.clearAll();
        window.location.href = '/auth/login';
    };

    const menuItems = [
        {
            title: 'Dashboard',
            url: '/admin',
            icon: Home,
        },
        {
            title: 'Publicaciones',
            url: '/admin/publicaciones',
            icon: FileText,
        },
        {
            title: 'Leads',
            url: '/admin/leads',
            icon: Users,
        },
        {
            title: 'Prospectos',
            url: '/admin/prospectos',
            icon: UserCheck,
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-2">
                    <div className="w-8 h-8 bg-[#005873] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">Anfibius</span>
                        <span className="text-xs text-muted-foreground">Sistema Contable</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={currentPath === item.url}
                                    >
                                        <a href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="px-3 py-2">
                    <div className="mb-2">
                        <p className="text-sm font-medium truncate">
                            {user?.nombre || 'Cargando...'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user?.correo || ''}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4"/>
                        <span>Cerrar Sesion</span>
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}