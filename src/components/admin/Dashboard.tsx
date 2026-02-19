import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

export default function Dashboard() {
  // Leads stats
  const leadsCounts = useQuery(api.leads.getLeadsCount);

  // Content stats
  const services = useQuery(api.services.getAllServices);
  const solutions = useQuery(api.solutions.getAllSolutions);
  const posts = useQuery(api.blog_posts.getAllPosts);
  const publishedPosts = useQuery(api.blog_posts.getPublishedPosts);
  const faqs = useQuery(api.faqs.getAllFaqs);
  const partners = useQuery(api.partners.getAll);
  const communes = useQuery(api.communes.getAll);
  const heroes = useQuery(api.heroes.getAllHeroes);

  // Calculate stats
  const activeServices =
    services?.filter((s) => s.is_active !== false).length ?? 0;
  const totalServices = services?.length ?? 0;
  const activeSolutions =
    solutions?.filter((s) => s.is_active !== false).length ?? 0;
  const totalSolutions = solutions?.length ?? 0;
  const totalPosts = posts?.length ?? 0;
  const publishedPostsCount = publishedPosts?.length ?? 0;

  // Partner counts by type
  const certifications =
    partners?.filter((p) => p.type === 'certification').length ?? 0;
  const clients = partners?.filter((p) => p.type === 'client').length ?? 0;
  const techPartners =
    partners?.filter((p) => p.type === 'tech_partner').length ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona el contenido y configuración del sitio Guardman
        </p>
      </div>

      {/* Leads Stats */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Estado de Leads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Leads"
            value={leadsCounts?.total}
            icon="users"
            color="blue"
          />
          <StatCard
            title="Nuevos"
            value={leadsCounts?.new}
            icon="check"
            color="green"
          />
          <StatCard
            title="Convertidos"
            value={leadsCounts?.converted}
            icon="document"
            color="purple"
          />
        </div>
      </section>

      {/* Content Stats */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Contenido del Sitio
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard
            title="Servicios"
            value={activeServices}
            subtitle={`de ${totalServices} activos`}
            icon="shield"
            color="indigo"
          />
          <StatCard
            title="Soluciones"
            value={activeSolutions}
            subtitle={`de ${totalSolutions} activas`}
            icon="lightbulb"
            color="amber"
          />
          <StatCard
            title="Blog Posts"
            value={publishedPostsCount}
            subtitle={`de ${totalPosts} publicados`}
            icon="article"
            color="emerald"
          />
          <StatCard
            title="FAQs"
            value={faqs?.length}
            icon="question"
            color="sky"
          />
          <StatCard
            title="Héroes"
            value={heroes?.length}
            icon="star"
            color="rose"
          />
          <StatCard
            title="Comunas"
            value={communes?.length}
            icon="location"
            color="teal"
          />
        </div>
      </section>

      {/* Partners Stats */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Partners & Clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Certificaciones"
            value={certifications}
            icon="badge"
            color="blue"
          />
          <StatCard
            title="Clientes"
            value={clients}
            icon="building"
            color="green"
          />
          <StatCard
            title="Partners Tecnológicos"
            value={techPartners}
            icon="chip"
            color="purple"
          />
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Acceso Rápido
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickLinkCard
            title="Servicios"
            href="/admin/services"
            icon="shield"
            description="Gestionar servicios"
          />
          <QuickLinkCard
            title="Soluciones"
            href="/admin/solutions"
            icon="lightbulb"
            description="Gestionar soluciones"
          />
          <QuickLinkCard
            title="Héroes"
            href="/admin/heroes"
            icon="star"
            description="Editar sliders"
          />
          <QuickLinkCard
            title="Blog"
            href="/admin/blog"
            icon="article"
            description="Artículos"
          />
          <QuickLinkCard
            title="Comunas"
            href="/admin/communes"
            icon="location"
            description="SEO por zona"
          />
          <QuickLinkCard
            title="FAQs"
            href="/admin/faqs"
            icon="question"
            description="Preguntas frecuentes"
          />
        </div>
      </section>

      {/* Additional Quick Links */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLinkCard
            title="Partners"
            href="/admin/partners"
            icon="building"
            description="Clientes y certificaciones"
          />
          <QuickLinkCard
            title="Leads"
            href="/admin/leads"
            icon="users"
            description="Contactos recibidos"
          />
          <QuickLinkCard
            title="Comunas"
            href="/admin/communes"
            icon="location"
            description="SEO por zona"
          />
          <QuickLinkCard
            title="Configuración"
            href="/admin/config"
            icon="settings"
            description="Ajustes del sitio"
          />
        </div>
      </section>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value?: number;
  subtitle?: string;
  icon: string;
  color:
    | 'blue'
    | 'green'
    | 'purple'
    | 'indigo'
    | 'amber'
    | 'emerald'
    | 'sky'
    | 'rose'
    | 'teal';
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    sky: 'bg-sky-100 text-sky-600',
    rose: 'bg-rose-100 text-rose-600',
    teal: 'bg-teal-100 text-teal-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
          <Icon name={icon} className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-500 truncate">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {value !== undefined ? value : '...'}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick Link Card Component
interface QuickLinkCardProps {
  title: string;
  href: string;
  icon: string;
  description: string;
}

function QuickLinkCard({ title, href, icon, description }: QuickLinkCardProps) {
  return (
    <a
      href={href}
      className="group bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all"
    >
      <div className="flex flex-col items-center text-center">
        <div className="p-3 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-700 transition-colors mb-3">
          <Icon name={icon} className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </a>
  );
}

// Icon Component
interface IconProps {
  name: string;
  className?: string;
}

function Icon({ name, className = 'w-6 h-6' }: IconProps) {
  const icons: Record<string, JSX.Element> = {
    users: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    check: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    document: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
    shield: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    lightbulb: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    article: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
        />
      </svg>
    ),
    question: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    star: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
    location: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    badge: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    building: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    chip: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
    map: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    settings: (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  };

  return icons[name] || <span className={className}>?</span>;
}
