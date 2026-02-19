import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import {
  Home,
  Users,
  Shield,
  Lightbulb,
  Star,
  FileText,
  HelpCircle,
  Users2,
  MessageSquare,
  MapPin,
  Building2,
  Factory,
  Pen,
  Heart,
  ClipboardList,
  BarChart3,
  MousePointerClick,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Servicios', href: '/services', icon: Shield },
    { name: 'Soluciones', href: '/solutions', icon: Lightbulb },
    { name: 'Héroes', href: '/heroes', icon: Star },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'FAQs', href: '/faqs', icon: HelpCircle },
    { name: 'Equipo', href: '/team', icon: Users2 },
    { name: 'Testimonios', href: '/testimonials', icon: MessageSquare },
    { name: 'Comunas', href: '/communes', icon: MapPin },
    { name: 'Partners', href: '/partners', icon: Building2 },
    { name: 'Industrias', href: '/industries', icon: Factory },
    { name: 'Autores', href: '/authors', icon: Pen },
    { name: 'Valores', href: '/company-values', icon: Heart },
    { name: 'Procesos', href: '/process-steps', icon: ClipboardList },
    { name: 'Estadísticas', href: '/stats', icon: BarChart3 },
    { name: 'CTAs', href: '/ctas', icon: MousePointerClick },
    { name: 'Config', href: '/config', icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900 px-4 py-3 flex items-center justify-between shadow-md">
        <NavLink to="/" className="text-white font-bold text-lg">
          Guardman Admin
        </NavLink>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 hover:text-white p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 text-white
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-5 border-b border-gray-800 shrink-0">
            <NavLink to="/" className="text-xl font-bold tracking-tight">
              🛡️ Guardman
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
                end={item.href === '/'}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer / Logout */}
          <div className="p-4 border-t border-gray-800 shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
