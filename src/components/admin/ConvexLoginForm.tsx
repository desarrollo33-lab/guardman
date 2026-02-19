import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { getConvexClient } from '../../lib/convex';
import LoginForm from './LoginForm';

/**
 * Self-contained login form wrapper with its own Convex auth context.
 * Required because Astro islands don't share React context — 
 * LoginForm needs ConvexAuthProvider as a parent.
 */
export default function ConvexLoginForm() {
    return (
        <ConvexAuthProvider client={getConvexClient()}>
            <LoginForm />
        </ConvexAuthProvider>
    );
}
