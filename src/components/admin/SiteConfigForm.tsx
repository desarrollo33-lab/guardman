import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';

interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
}

interface NavbarChild {
  label: string;
  href: string;
}

interface NavbarItem {
  label: string;
  href: string;
  is_button?: boolean;
  children?: NavbarChild[];
}

interface SiteConfig {
  _id: Id<'site_config'>;
  is_active: boolean;
  brand_name: string;
  phone_primary: string;
  phone_secondary?: string;
  whatsapp_number: string;
  email_contact: string;
  address_main?: string;
  social_links: SocialLinks;
  navbar_items: NavbarItem[];
}

interface FormData {
  brand_name: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp_number: string;
  email_contact: string;
  address_main: string;
  social_links: SocialLinks;
  navbar_items: NavbarItem[];
}

const initialFormData: FormData = {
  brand_name: 'Guardman',
  phone_primary: '',
  phone_secondary: '',
  whatsapp_number: '',
  email_contact: '',
  address_main: '',
  social_links: {
    instagram: '',
    linkedin: '',
    facebook: '',
    youtube: '',
  },
  navbar_items: [],
};

export default function SiteConfigForm() {
  const config = useQuery(api.site_config.get) as SiteConfig | null | undefined;
  const updateConfig = useMutation(api.site_config.update);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [expandedNavbarIndex, setExpandedNavbarIndex] = useState<number | null>(
    null
  );

  // Initialize form with config data
  useEffect(() => {
    if (config) {
      setFormData({
        brand_name: config.brand_name || '',
        phone_primary: config.phone_primary || '',
        phone_secondary: config.phone_secondary || '',
        whatsapp_number: config.whatsapp_number || '',
        email_contact: config.email_contact || '',
        address_main: config.address_main || '',
        social_links: config.social_links || {
          instagram: '',
          linkedin: '',
          facebook: '',
          youtube: '',
        },
        navbar_items: config.navbar_items || [],
      });
    }
  }, [config]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (saveStatus === 'success') {
      const timer = setTimeout(() => setSaveStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Social links handler
  const handleSocialChange = useCallback(
    (field: keyof SocialLinks, value: string) => {
      setFormData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [field]: value,
        },
      }));
    },
    []
  );

  // Navbar items handlers
  const addNavbarItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      navbar_items: [
        ...prev.navbar_items,
        { label: 'Nuevo Item', href: '/', is_button: false, children: [] },
      ],
    }));
  }, []);

  const removeNavbarItem = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      navbar_items: prev.navbar_items.filter((_, i) => i !== index),
    }));
  }, []);

  const updateNavbarItem = useCallback(
    (index: number, field: keyof NavbarItem, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        navbar_items: prev.navbar_items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  // Children handlers
  const addChild = useCallback((navbarIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      navbar_items: prev.navbar_items.map((item, i) =>
        i === navbarIndex
          ? {
              ...item,
              children: [
                ...(item.children || []),
                { label: 'Subitem', href: '/' },
              ],
            }
          : item
      ),
    }));
  }, []);

  const removeChild = useCallback((navbarIndex: number, childIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      navbar_items: prev.navbar_items.map((item, i) =>
        i === navbarIndex
          ? {
              ...item,
              children: item.children?.filter((_, ci) => ci !== childIndex),
            }
          : item
      ),
    }));
  }, []);

  const updateChild = useCallback(
    (
      navbarIndex: number,
      childIndex: number,
      field: keyof NavbarChild,
      value: string
    ) => {
      setFormData((prev) => ({
        ...prev,
        navbar_items: prev.navbar_items.map((item, i) =>
          i === navbarIndex
            ? {
                ...item,
                children: item.children?.map((child, ci) =>
                  ci === childIndex ? { ...child, [field]: value } : child
                ),
              }
            : item
        ),
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.brand_name.trim() ||
      !formData.phone_primary.trim() ||
      !formData.whatsapp_number.trim() ||
      !formData.email_contact.trim()
    ) {
      alert(
        'Por favor completa los campos requeridos: Nombre de marca, Teléfono principal, WhatsApp y Email'
      );
      return;
    }

    setIsSubmitting(true);
    setSaveStatus('idle');

    try {
      await updateConfig({
        id: config?._id,
        brand_name: formData.brand_name.trim(),
        phone_primary: formData.phone_primary.trim(),
        phone_secondary: formData.phone_secondary.trim() || undefined,
        whatsapp_number: formData.whatsapp_number.trim(),
        email_contact: formData.email_contact.trim(),
        address_main: formData.address_main.trim() || undefined,
        social_links: {
          instagram: formData.social_links.instagram?.trim() || undefined,
          linkedin: formData.social_links.linkedin?.trim() || undefined,
          facebook: formData.social_links.facebook?.trim() || undefined,
          youtube: formData.social_links.youtube?.trim() || undefined,
        },
        navbar_items: formData.navbar_items,
      });
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (config === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success/Error Messages */}
      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Configuración guardada correctamente
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Error al guardar. Intenta nuevamente.
        </div>
      )}

      {/* Brand Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
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
          Información de Marca
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Marca <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brand_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, brand_name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Guardman"
              required
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Contacto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono Principal <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone_primary}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phone_primary: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+56 2 2345 6789"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono Secundario
            </label>
            <input
              type="tel"
              value={formData.phone_secondary}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phone_secondary: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+56 9 1234 5678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.whatsapp_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  whatsapp_number: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+56912345678"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Número con código de país, sin espacios ni guiones
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de Contacto <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email_contact}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email_contact: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="contacto@guardman.cl"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección Principal
            </label>
            <textarea
              value={formData.address_main}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address_main: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Av. Principal 123, Oficina 456, Santiago, Chile"
            />
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          Redes Sociales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </span>
              <input
                type="url"
                value={formData.social_links.instagram || ''}
                onChange={(e) =>
                  handleSocialChange('instagram', e.target.value)
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://instagram.com/guardmancl"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
              <input
                type="url"
                value={formData.social_links.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/company/guardman"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              <input
                type="url"
                value={formData.social_links.facebook || ''}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://facebook.com/guardmancl"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </span>
              <input
                type="url"
                value={formData.social_links.youtube || ''}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://youtube.com/@guardmancl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Navbar Items Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Items del Menú de Navegación
          </h2>
          <button
            type="button"
            onClick={addNavbarItem}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar Item
          </button>
        </div>

        {formData.navbar_items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>
              No hay items en el menú. Haz clic en "Agregar Item" para comenzar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.navbar_items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Navbar Item Header */}
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    setExpandedNavbarIndex(
                      expandedNavbarIndex === index ? null : index
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedNavbarIndex === index ? 'rotate-90' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-500 font-mono">
                      {item.href}
                    </span>
                    {item.is_button && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Botón
                      </span>
                    )}
                    {item.children && item.children.length > 0 && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                        {item.children.length} subitems
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNavbarItem(index);
                    }}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Navbar Item Expanded Content */}
                {expandedNavbarIndex === index && (
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Etiqueta
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            updateNavbarItem(index, 'label', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Enlace (href)
                        </label>
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) =>
                            updateNavbarItem(index, 'href', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.is_button || false}
                          onChange={(e) =>
                            updateNavbarItem(
                              index,
                              'is_button',
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm font-medium text-gray-700">
                        Mostrar como botón
                      </span>
                    </div>

                    {/* Children (Submenu) */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Submenú (Children)
                        </h4>
                        <button
                          type="button"
                          onClick={() => addChild(index)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Agregar
                        </button>
                      </div>

                      {item.children && item.children.length > 0 ? (
                        <div className="space-y-2 pl-4">
                          {item.children.map((child, childIndex) => (
                            <div
                              key={childIndex}
                              className="flex items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4 text-gray-300 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M3 14h18"
                                />
                              </svg>
                              <input
                                type="text"
                                value={child.label}
                                onChange={(e) =>
                                  updateChild(
                                    index,
                                    childIndex,
                                    'label',
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Etiqueta"
                              />
                              <input
                                type="text"
                                value={child.href}
                                onChange={(e) =>
                                  updateChild(
                                    index,
                                    childIndex,
                                    'href',
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="/ruta"
                              />
                              <button
                                type="button"
                                onClick={() => removeChild(index, childIndex)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 pl-4">
                          Sin subitems
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardar Configuración
            </>
          )}
        </button>
      </div>
    </form>
  );
}
