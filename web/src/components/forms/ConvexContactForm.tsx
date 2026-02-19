import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import ContactForm from './ContactForm';

interface ConvexContactFormProps {
  servicio?: string;
  onSuccess?: () => void;
}

/**
 * Wrapper that provides Convex context to ContactForm.
 * Required for Astro integration - use this instead of ContactForm directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexContactForm(props: ConvexContactFormProps) {
  return (
    <ConvexProvider client={convex}>
      <ContactForm {...props} />
    </ConvexProvider>
  );
}
