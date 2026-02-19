import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>

          <footer className="mt-8 text-center text-sm text-gray-400 pb-4">
            Guardman Chile - Panel de Administración
          </footer>
        </div>
      </main>
    </div>
  );
}
