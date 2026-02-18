import LeadForm from './LeadForm';

interface ContactFormProps {
  servicio?: string;
  onSuccess?: () => void;
}

export default function ContactForm({ servicio, onSuccess }: ContactFormProps) {
  return (
    <div className="bg-white rounded-3xl shadow-elevated overflow-hidden">
      {/* Header decorativo */}
      <div className="bg-gradient-to-r from-gray-900 to-black px-6 py-4">
        <h3 className="text-white font-bold text-lg">
          Solicita tu cotización gratuita
        </h3>
        <p className="text-white/80 text-sm mt-1">
          Te contactamos en menos de 24 horas
        </p>
      </div>

      {/* Form content */}
      <div className="p-6">
        <LeadForm servicio={servicio} source="contacto" onSuccess={onSuccess} />

        {/* Trust indicators */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Sin compromiso
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Respuesta en 24h
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Cotización gratuita
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
