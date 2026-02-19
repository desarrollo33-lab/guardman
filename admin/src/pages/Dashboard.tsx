import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

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
            color="blue"
          />
          <StatCard title="Nuevos" value={leadsCounts?.new} color="green" />
          <StatCard
            title="Convertidos"
            value={leadsCounts?.converted}
            color="purple"
          />
        </div>
      </section>

      {/* Content Stats */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Contenido del Sitio
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Servicios"
            value={activeServices}
            subtitle={`de ${totalServices} activos`}
            color="indigo"
          />
          <StatCard
            title="Soluciones"
            value={activeSolutions}
            subtitle={`de ${totalSolutions} activas`}
            color="amber"
          />
          <StatCard
            title="Blog Posts"
            value={publishedPostsCount}
            subtitle={`de ${totalPosts} publicados`}
            color="emerald"
          />
          <StatCard title="FAQs" value={faqs?.length} color="sky" />
          <StatCard title="Héroes" value={heroes?.length} color="rose" />
          <StatCard title="Comunas" value={communes?.length} color="teal" />
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
            color="blue"
          />
          <StatCard title="Clientes" value={clients} color="green" />
          <StatCard
            title="Partners Tecnológicos"
            value={techPartners}
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
            href="/services"
            description="Gestionar servicios"
          />
          <QuickLinkCard
            title="Soluciones"
            href="/solutions"
            description="Gestionar soluciones"
          />
          <QuickLinkCard
            title="Héroes"
            href="/heroes"
            description="Editar sliders"
          />
          <QuickLinkCard title="Blog" href="/blog" description="Artículos" />
          <QuickLinkCard
            title="Comunas"
            href="/communes"
            description="SEO por zona"
          />
          <QuickLinkCard title="FAQs" href="/faqs" description="Preguntas" />
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

function StatCard({ title, value, subtitle, color }: StatCardProps) {
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
          <div className="w-5 h-5 bg-current rounded opacity-50" />
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
  description: string;
}

function QuickLinkCard({ title, href, description }: QuickLinkCardProps) {
  return (
    <a
      href={href}
      className="group bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all"
    >
      <div className="flex flex-col items-center text-center">
        <div className="p-3 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-700 transition-colors mb-3">
          <div className="w-6 h-6 bg-current rounded opacity-30" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </a>
  );
}
