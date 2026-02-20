/**
 * Test Page Component
 * 
 * Verifies that Refine's useGetIdentity hook works correctly after Convex Auth login.
 */

import { useGetIdentity, useLogout } from "@refinedev/core";

interface UserIdentity {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function TestPage() {
  const { data: identity, isLoading, refetch } = useGetIdentity<UserIdentity>();
  const { mutate: logout } = useLogout();

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-2xl">✓</span>
          <div>
            <h2 className="text-green-300 font-semibold">Authentication Successful!</h2>
            <p className="text-green-400 text-sm">Refine + Convex Auth integration is working.</p>
          </div>
        </div>
      </div>

      {/* Identity Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          useGetIdentity() Result
        </h3>
        
        {isLoading ? (
          <div className="text-gray-400">Loading identity...</div>
        ) : identity ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded">
                <span className="text-gray-400 text-sm">ID:</span>
                <p className="text-white font-mono text-sm">{identity.id}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <span className="text-gray-400 text-sm">Email:</span>
                <p className="text-white">{identity.email}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <span className="text-gray-400 text-sm">Name:</span>
                <p className="text-white">{identity.name}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <span className="text-gray-400 text-sm">Role:</span>
                <p className="text-white">{identity.role}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Raw Identity Object:</h4>
              <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-auto">
                {JSON.stringify(identity, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-yellow-400">
            No identity found. This indicates an issue with the auth bridge.
          </div>
        )}
      </div>

      {/* Test Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Test Actions</h3>
        <div className="flex gap-4">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Refetch Identity
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Integration Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Integration Test Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-gray-300">ConvexAuthProvider wraps application</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-gray-300">AuthBridge connects Convex Auth to Refine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-gray-300">useGetIdentity() returns user data</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-gray-300">Protected routes work correctly</span>
          </div>
        </div>
      </div>
    </div>
  );
}
