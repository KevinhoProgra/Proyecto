function Sidebar() {

    const menuItems = [
        { name: 'Dashboard', icon: '📊' },
        { name: 'Vehicles', icon: '🚗' },
        { name: 'Customers', icon: '👥' },
        { name: 'Providers', icon: '🏢' },
        { name: 'Suppliers', icon: '⚙️' },
        { name: 'Reports', icon: '💰' },
    ];
    return (
        <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col p-4 border-r border-slate-800">
            <ul className="space-y-2">
                {menuItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.name}</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;