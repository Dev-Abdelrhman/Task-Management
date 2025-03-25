import { Link, NavLink } from 'react-router-dom';
import { Home, Folder, ListChecks, Settings2 } from 'lucide-react';
import logo from '../assets/logo.png';

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-50 border-r border-gray-200 p-6 fixed left-0 top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-4 pt-4 mb-8">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <Home className="h-5 w-5 mr-3" />
          <span className="font-medium">Overview</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <Folder className="h-5 w-5 mr-3" />
          <span className="font-medium">Projects</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <ListChecks className="h-5 w-5 mr-3" />
          <span className="font-medium">All Tasks</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <Settings2 className="h-5 w-5 mr-3" />
          <span className="font-medium">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;