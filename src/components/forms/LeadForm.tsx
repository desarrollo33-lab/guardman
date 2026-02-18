import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

interface LeadFormProps {
  servicio?: string;
  source?: string;
  onSuccess?: () => void;
  compact?: boolean;
  theme?: 'light' | 'dark';
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  nombre: string;
  telefono: string;
  email?: string;
  servicio: string;
  ciudad: string;
  mensaje?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const initialFormData: FormData = {
  nombre: '',
  telefono: '',
  email: '',
  servicio: '',
  ciudad: '',
  mensaje: '',
  utm_source: undefined,
  utm_medium: undefined,
  utm_campaign: undefined,
};

const FALLBACK_SERVICES = [
  { id: 'guardias', title: 'Guardias de Seguridad' },
  { id: 'patrullaje', title: 'Patrullaje de Condominios' },
  { id: 'alarmas', title: 'Alarmas Ajax Systems' },
  { id: 'guardpod', title: 'Módulos GuardPod' },
  { id: 'drones', title: 'Drones de Seguridad' },
  { id: 'control', title: 'Control de Acceso' },
];

const FALLBACK_COMMUNES = [
  'Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Lo Barnechea',
  'Ñuñoa', 'La Reina', 'Peñalolén', 'Macul', 'La Florida',
  'San Miguel', 'Estación Central', 'Maipú', 'Puente Alto'
];

export default function LeadForm({
  servicio,
  source,
  onSuccess,
  compact = false,
  theme = 'light',
}: LeadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    servicio: servicio || '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  // Load data from Convex
  const servicesData = useQuery(api.services.getAllServices);
  const locationsData = useQuery(api.locations.getAllLocations);

  // Type for Convex service response
  type ConvexService = {
    _id: string;
    title: string;
    slug?: string;
    id?: string;
    [key: string]: unknown;
  };

  // Type for Convex location response
  type ConvexLocation = {
    _id: string;
    name: string;
    slug?: string;
    isOtherCity?: boolean;
    [key: string]: unknown;
  };

  // Derive services list — Convex data or fallback
  const services: ConvexService[] =
    servicesData && servicesData.length > 0
      ? servicesData
      : FALLBACK_SERVICES.map(s => ({ _id: s.id, ...s }));

  // Derive locations — Convex data or fallback
  const rmCommunes: string[] = locationsData && locationsData.communes.length > 0
    ? locationsData.communes
      .map((c: ConvexLocation) => c.name)
      .sort((a: string, b: string) => a.localeCompare(b, 'es'))
    : FALLBACK_COMMUNES.sort((a, b) => a.localeCompare(b, 'es'));

  const otrasCiudades: string[] = locationsData
    ? locationsData.otherCities.map((c: ConvexLocation) => c.name)
    : [];

  // Loading state - only if we didn't have fallbacks (but we do now)
  // We allow rendering immediately with fallbacks to avoid blocking the UI
  const isLoadingData = false;

  // Submit handler - sends to API endpoint
  const submitLead = async (data: FormData): Promise<void> => {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        source: source || 'website',
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit lead');
    }
  };

  // Capturar UTM params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const utm_source = params.get('utm_source') || undefined;
      const utm_medium = params.get('utm_medium') || undefined;
      const utm_campaign = params.get('utm_campaign') || undefined;

      if (utm_source || utm_medium || utm_campaign) {
        setFormData((prev) => ({
          ...prev,
          ...(utm_source && { utm_source }),
          ...(utm_medium && { utm_medium }),
          ...(utm_campaign && { utm_campaign }),
        }));
      }
    }
  }, []);

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2)
          return 'El nombre debe tener al menos 2 caracteres';
        return '';
      case 'telefono':
        if (!value.trim()) return 'El teléfono es requerido';
        const phoneClean = value.replace(/[\s\-\+\(\)]/g, '');
        if (!/^\d{9,11}$/.test(phoneClean))
          return 'Ingresa un teléfono válido (9 dígitos)';
        return '';
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Ingresa un email válido';
        return '';
      case 'servicio':
        if (!value) return 'Selecciona un servicio';
        return '';
      case 'ciudad':
        if (!value) return 'Selecciona tu ciudad o comuna';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof FormData]) {
      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const formatPhoneInput = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 1) return `+56 ${cleaned}`;
    if (cleaned.length <= 5)
      return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1)}`;
    if (cleaned.length <= 9) {
      return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`;
    }
    return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5, 9)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setFormData((prev) => ({ ...prev, telefono: formatted }));

    if (touched.telefono) {
      const error = validateField('telefono', formatted);
      setErrors((prev) => ({ ...prev, telefono: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    const validatedFields: Array<keyof FormData> = [
      'nombre',
      'telefono',
      'email',
      'servicio',
      'ciudad',
      'mensaje',
    ];

    validatedFields.forEach((key) => {
      const error = validateField(key, formData[key] ?? '');
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      nombre: true,
      telefono: true,
      email: true,
      servicio: true,
      ciudad: true,
      mensaje: true,
    });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('loading');

    try {
      await submitLead({
        nombre: formData.nombre.trim(),
        telefono: formData.telefono,
        email: formData.email?.trim() || undefined,
        servicio: formData.servicio,
        ciudad: formData.ciudad,
        mensaje: formData.mensaje?.trim() || undefined,
        utm_source: formData.utm_source,
        utm_medium: formData.utm_medium,
        utm_campaign: formData.utm_campaign,
      });

      setStatus('success');
      setFormData(initialFormData);
      setTouched({});
      onSuccess?.();
    } catch (error) {
      console.error('Error creating lead:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8 px-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          ¡Mensaje enviado!
        </h3>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Nos pondremos en contacto contigo dentro de las próximas 24 horas.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className={`font-medium hover:underline ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  // Loading state while fetching data from Convex
  if (isLoadingData) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-14 bg-gray-300 rounded-xl"></div>
      </div>
    );
  }

  // Error state if Convex data failed to load (null) - show form anyway with static fallback
  // The fallback data is already handled in the derived variables above

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Nombre completo <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tu nombre completo"
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-gray-900
            ${errors.nombre && touched.nombre
              ? 'border-error bg-error/5 focus:border-error focus:ring-error/20'
              : 'border-gray-200 bg-white focus:border-gray-900 focus:ring-gray-900/20'
            }
            focus:outline-none focus:ring-4 placeholder:text-gray-400`}
        />
        {errors.nombre && touched.nombre && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.nombre}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label
          htmlFor="telefono"
          className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Teléfono <span className="text-error">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          placeholder="+56 9 1234 5678"
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-gray-900
            ${errors.telefono && touched.telefono
              ? 'border-error bg-error/5 focus:border-error focus:ring-error/20'
              : 'border-gray-200 bg-white focus:border-gray-900 focus:ring-gray-900/20'
            }
            focus:outline-none focus:ring-4 placeholder:text-gray-400`}
        />
        {errors.telefono && touched.telefono && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.telefono}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Email{' '}
          <span className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>(opcional)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="tu@email.com"
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-gray-900
            ${errors.email && touched.email
              ? 'border-error bg-error/5 focus:border-error focus:ring-error/20'
              : 'border-gray-200 bg-white focus:border-gray-900 focus:ring-gray-900/20'
            }
            focus:outline-none focus:ring-4 placeholder:text-gray-400`}
        />
        {errors.email && touched.email && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.email}
          </p>
        )}
      </div>

      {/* Servicio */}
      <div>
        <label
          htmlFor="servicio"
          className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Servicio <span className="text-error">*</span>
        </label>
        <select
          id="servicio"
          name="servicio"
          value={formData.servicio}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 appearance-none cursor-pointer text-gray-900
            ${errors.servicio && touched.servicio
              ? 'border-error bg-error/5 focus:border-error focus:ring-error/20'
              : 'border-gray-200 bg-white focus:border-gray-900 focus:ring-gray-900/20'
            }
            focus:outline-none focus:ring-4
            bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%236B7280%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')]
            bg-[length:1.5rem] bg-[right:0.75rem_center] bg-no-repeat`}
        >
          <option value="">Selecciona un servicio</option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
        {errors.servicio && touched.servicio && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.servicio}
          </p>
        )}
      </div>

      {/* Ciudad/Comuna */}
      <div>
        <label
          htmlFor="ciudad"
          className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Ciudad / Comuna <span className="text-error">*</span>
        </label>
        <select
          id="ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 appearance-none cursor-pointer text-gray-900
            ${errors.ciudad && touched.ciudad
              ? 'border-error bg-error/5 focus:border-error focus:ring-error/20'
              : 'border-gray-200 bg-white focus:border-gray-900 focus:ring-gray-900/20'
            }
            focus:outline-none focus:ring-4
            bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2f2000%2fsvg%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%236B7280%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')]
            bg-[length:1.5rem] bg-[right:0.75rem_center] bg-no-repeat`}
        >
          <option value="">Selecciona tu comuna</option>
          <optgroup label="Región Metropolitana">
            {rmCommunes.map((comuna) => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </optgroup>
          <optgroup label="Otras ciudades (fuera de RM)">
            {otrasCiudades.map((ciudad) => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </optgroup>
        </select>
        {errors.ciudad && touched.ciudad && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.ciudad}
          </p>
        )}
      </div>

      {/* Mensaje */}
      <div>
        <label
          htmlFor="mensaje"
          className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Mensaje{' '}
          <span className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>(opcional)</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={compact ? 3 : 4}
          placeholder="Cuéntanos sobre tu necesidad de seguridad..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900
            focus:border-gray-900 focus:ring-4 focus:ring-gray-900/20
            focus:outline-none transition-all duration-200 placeholder:text-gray-400 resize-none"
        />
      </div>

      {/* Error general */}
      {status === 'error' && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 animate-slide-down">
          <p className="text-error flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg
          transition-all duration-300 transform
          ${status === 'loading'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-900 hover:bg-gray-800 hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0'
          }
          focus:outline-none focus:ring-4 focus:ring-gray-500`}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          'Cotizar Ahora'
        )}
      </button>

      {/* Privacy note */}
      <p className={`text-xs text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Al enviar este formulario aceptas nuestra{' '}
        <a href="/privacidad" className={`${theme === 'dark' ? 'text-white hover:text-gray-200' : 'text-gray-900 hover:underline'}`}>
          Política de Privacidad
        </a>
        .
      </p>
    </form>
  );
}
