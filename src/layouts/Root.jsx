import React, { useEffect, useState, createContext, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, setInitialized } from '@/store/userSlice';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContext');
  }
  return context;
};

const Root = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitializedState] = useState(false);

  const handleNavigation = () => {
    const currentPath = location.pathname;
    const isAuthPage = ['/login', '/signup', '/callback', '/error'].includes(currentPath);
    
    if (!isAuthPage && currentPath !== '/') {
      // User is on a protected page, stay there
      return;
    }
    
    if (!isAuthPage) {
      navigate('/', { replace: true });
    }
  };

  const logout = () => {
    try {
      if (window.ApperSDK && window.ApperSDK.logout) {
        window.ApperSDK.logout();
      }
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(clearUser());
      navigate('/login');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Wait for SDK to be available
        let retries = 0;
        const maxRetries = 10;
        let sdkAvailable = false;

        while (!sdkAvailable && retries < maxRetries) {
          if (window.ApperSDK) {
            sdkAvailable = true;
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
          retries++;
        }

        if (!sdkAvailable) {
          console.error('ApperSDK not available after retry attempts');
          dispatch(clearUser());
          dispatch(setInitialized(true));
          setAuthInitialized(true);
          setIsInitializedState(true);
          return;
        }

        // Initialize ApperClient
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        // Store client globally
        window.apperClientInstance = apperClient;

        // Initialize ApperUI with authentication handlers
        if (window.ApperSDK.initializeApperUI) {
          window.ApperSDK.initializeApperUI();
        }

        // Check if user is already authenticated
        if (window.ApperSDK && window.ApperSDK.getUser) {
          const currentUser = window.ApperSDK.getUser();
          if (currentUser) {
            console.log('Authentication successful:', currentUser);
            dispatch(setUser(currentUser));
            handleNavigation();
          } else {
            dispatch(clearUser());
          }
        } else {
          dispatch(clearUser());
        }

      } catch (error) {
        console.error('Authentication initialization error:', error);
        setError(error);
        dispatch(clearUser());
      } finally {
        dispatch(setInitialized(true));
        setAuthInitialized(true);
        setIsInitializedState(true);
      }
    };

    initializeAuth();
  }, [dispatch, navigate, location]);

  if (error) {
    return (
      <ErrorView
        title="Initialization Error"
        message={`Failed to initialize the application: ${error.message}`}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ logout, isInitialized: authInitialized }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default Root;