/**
 * SEO Preview Component
 * 
 * Shows Google SERP preview and social media (OG) preview.
 * Updates in real-time as the user types.
 */

interface SeoPreviewProps {
  title: string;
  slug: string;
  description: string;
  image?: string;
  siteName?: string;
  url?: string;
}

export function SeoPreview({
  title,
  slug,
  description,
  image,
  siteName = "Guardman",
  url = "https://guardman.cl",
}: SeoPreviewProps) {
  const fullUrl = `${url}/${slug}`;

  // Truncate title for SERP (typically 50-60 chars)
  const serpTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  
  // Truncate description for SERP (typically 160 chars)
  const serpDescription = description.length > 160 
    ? description.slice(0, 157) + "..." 
    : description;

  return (
    <div className="space-y-6">
      {/* SERP Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Vista previa en Google
        </h3>
        
        <div className="font-sans">
          {/* Google URL */}
          <div className="text-xs text-gray-500 mb-1 truncate">
            {fullUrl}
          </div>
          
          {/* Google Title */}
          <div className="text-lg text-[#1a0dab] hover:underline cursor-pointer truncate">
            {serpTitle || "Título de la página"}
          </div>
          
          {/* Google Description */}
          <div className="text-sm text-[#545454] mt-1 line-clamp-2">
            {serpDescription || "Descripción de la página para SEO. Aquí se mostrará el contenido del meta description."}
          </div>
        </div>
      </div>

      {/* Social Media Preview Tabs */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Vista previa social
        </h3>

        {/* Facebook/LinkedIn OG Preview */}
        <div className="border border-gray-200 rounded overflow-hidden">
          {image ? (
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-.01M66-6h 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="p-3 bg-gray-50">
            <div className="text-xs text-gray-500 uppercase">
              {siteName}
            </div>
            <div className="text-base font-bold text-[#1877f2] truncate">
              {title || "Título"}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2">
              {description || "Descripción de la página"}
            </div>
          </div>
        </div>

        {/* Twitter/X Card Preview */}
        <div className="mt-4 border border-gray-200 rounded overflow-hidden">
          {image ? (
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="p-3 bg-white">
            <div className="text-base font-bold text-black truncate">
              {title || "Título"}
            </div>
            <div className="text-sm text-gray-500 line-clamp-2">
              {description || "Descripción de la página"}
            </div>
            <div className="text-xs text-gray-500 mt-1 truncate">
              {url}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
