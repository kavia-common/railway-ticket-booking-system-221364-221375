import { useAuthContext } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function useAuth() {
  /** Simple wrapper hook for AuthContext */
  return useAuthContext();
}
