/**
 * useAuth — re-exports from AuthContext for backwards compatibility.
 * All components that import from here will use the global auth state
 * provided by AuthProvider in App.jsx.
 */
export { useAuth } from '../contexts/AuthContext';
