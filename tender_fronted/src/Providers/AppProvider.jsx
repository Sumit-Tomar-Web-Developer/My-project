import { AuthProvider } from './AuthProvider';
import { ToastProvider } from './ToastProvider';

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}