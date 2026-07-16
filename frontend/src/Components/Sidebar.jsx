import { NavLink } from 'react-router-dom';

function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Vehicles', path: '/vehicles', icon: '🚗' },
    { name: 'Customers', path: '/customers', icon: '👥' },
    { name: 'Providers', path: '/providers', icon: '🏢' },
    { name: 'Suppliers', path: '/suppliers', icon: '⚙️' },
    { name: 'Reports', path: '/reports', icon: '💰' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col p-4 border-r border-slate-800">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
