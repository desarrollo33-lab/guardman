import { ConvexProvider } from 'convex/react';
import { convex } from '../../lib/convex';
import LeadForm from './LeadForm';

interface ConvexLeadFormProps {
  servicio?: string;
  source?: string;
  onSuccess?: () => void;
  compact?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * Wrapper that provides Convex context to LeadForm.
 * Required for Astro integration - use this instead of LeadForm directly
 * when rendering in .astro files with client:* directives.
 */
export default function ConvexLeadForm(props: ConvexLeadFormProps) {
  return (
    <ConvexProvider client={convex}>
      <LeadForm {...props} />
    </ConvexProvider>
  );
}
