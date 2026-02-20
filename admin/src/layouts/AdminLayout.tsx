/**
 * Admin Layout with Sidebar Navigation
 * 
 * Layout for the Refine admin panel with sidebar for all resources.
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Button } from "../components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Star, 
  Building2,
  MapPin,
  Headphones,
  BarChart3,
  Cog,
  LogOut,
  Menu,
  X,
  FileStack,
  Briefcase,
  Globe,
  Settings
} from "lucide-react";

// Resource definitions for sidebar
const resources = [
  { name: "services", label: "Servicios", icon: Briefcase },
  { name: "solutions", label: "Soluciones", icon: Building2 },
  { name: "leads", label: "Leads", icon: Users },
  { name: "communes", label: "Comunas", icon: MapPin },
  { name: "blog_posts", label: "Blog", icon: FileText },
  { name: "heroes", label: "Heroes", icon: Globe },
  { name: "faqs", label: "FAQs", icon: MessageSquare },
  { name: "testimonials", label: "Testimonios", icon: Star },
  { name: "partners", label: "Partners", icon: Building2 },
  { name: "industries", label: "Industrias", icon: Building2 },
  { name: "ctas", label: "CTAs", icon: Headphones },
  { name: "stats", label: "Estadísticas", icon: BarChart3 },
  { name: "process_steps", label: "Procesos", icon: FileStack },
  { name: "team_members", label: "Equipo", icon: Users },
  { name: "company_values", label: "Valores", icon: Star },
  { name: "authors", label: "Autores", icon: Users },
  { name: "pages", label: "Páginas", icon: FileText },
  { name: "content_blocks", label: "Bloques", icon: FileStack },
  { name: "site_config", label: "Configuración", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <Link to="/test" className="text-xl font-bold text-green-400">
              Guardman
            </Link>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <Link
                to="/test"
                className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 ${
                  location.pathname === '/test' ? 'bg-gray-800 text-green-400' : ''
                }`}
              >
                <LayoutDashboard size={20} />
                {sidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            
            {sidebarOpen && (
              <li className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase mt-4">
                Recursos
              </li>
            )}
            
            {resources.map((resource) => (
              <li key={resource.name}>
                <Link
                  to={`/test/${resource.name}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 ${
                    location.pathname === `/test/${resource.name}` ? 'bg-gray-800 text-green-400' : ''
                  }`}
                >
                  <resource.icon size={20} />
                  {sidebarOpen && <span>{resource.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{identity?.name || identity?.email}</p>
                <p className="text-xs text-gray-500 truncate">{identity?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                className="text-gray-400 hover:text-white"
              >
                <LogOut size={20} />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              className="text-gray-400 hover:text-white w-full"
            >
              <LogOut size={20} />
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
