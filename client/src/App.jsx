import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Slide } from 'react-toastify';

import './main.css';
import Router from './Router';
import Loading from './components/Loading';
import ErrorPage from './pages/error/ErrorPage';
import ErrorBoundary from './contexts/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';


// App component
export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <AuthProvider>

        <LoadingProvider>
          <Loading /> {/* Loading component */}

          <Router /> {/* Main Router */}

        </LoadingProvider>

        {/* Toastify */}
        <ToastContainer
          theme="colored"
          draggable={false}
          transition={Slide}
          hideProgressBar={true}
          position="bottom-right"
        />

      </AuthProvider>
    </ErrorBoundary>
  )
}
