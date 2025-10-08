import { FileText, FolderOpen, Users, UserCheck } from 'lucide-react';

export default function DashboardContent() {
    const stats = [
        {
            title: 'Publicaciones',
            value: '12',
            icon: FileText,
            color: 'bg-blue-500',
        },
        {
            title: 'Recursos',
            value: '8',
            icon: FolderOpen,
            color: 'bg-green-500',
        },
        {
            title: 'Leads',
            value: '45',
            icon: Users,
            color: 'bg-purple-500',
        },
        {
            title: 'Prospectos',
            value: '23',
            icon: UserCheck,
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
                    >
                        <div className={`${stat.color} p-3 rounded-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Welcome Card */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Bienvenido al Panel de Administración
                </h2>
                <p className="text-gray-600">
                    Gestiona tus publicaciones, recursos, leads y prospectos desde aquí.
                </p>
            </div>
        </div>
    );
}