import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import LeadDetail from './LeadDetail';

interface ConvexLeadDetailProps {
  leadId?: string;
}

/**
 * Wrapper that provides Convex context to LeadDetail.
 * Required for Astro integration - use this instead of LeadDetail directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexLeadDetail({ leadId }: ConvexLeadDetailProps) {
  if (!leadId) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          ID de lead no proporcionado
        </h2>
        <p className="mt-2 text-gray-500">
          Selecciona un lead de la lista para ver sus detalles.
        </p>
        <a
          href="/admin/leads"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a leads
        </a>
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <LeadDetail leadId={leadId} />
    </ConvexProvider>
  );
}
