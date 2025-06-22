
import { createContext, useContext, useState, ReactNode } from 'react';
import SuccessToast from '@/components/notifications/SuccessToast';
import ErrorNotification from '@/components/notifications/ErrorNotification';
import ConfirmationModal from '@/components/notifications/ConfirmationModal';
import WelcomeModal from '@/components/notifications/WelcomeModal';
import UpgradeModal from '@/components/notifications/UpgradeModal';

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string, variant?: 'toast' | 'modal', title?: string) => void;
  showConfirmation: (
    title: string, 
    description: string, 
    onConfirm: () => void,
    variant?: 'default' | 'destructive'
  ) => void;
  showWelcome: (onStartOnboarding?: () => void, userName?: string) => void;
  showUpgrade: (featureName: string, onUpgrade?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [successToast, setSuccessToast] = useState({ isVisible: false, message: '' });
  const [errorNotification, setErrorNotification] = useState({ 
    isOpen: false, 
    message: '', 
    variant: 'toast' as 'toast' | 'modal',
    title: 'Error'
  });
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'default' as 'default' | 'destructive'
  });
  const [welcome, setWelcome] = useState({
    isOpen: false,
    onStartOnboarding: () => {},
    userName: 'there'
  });
  const [upgrade, setUpgrade] = useState({
    isOpen: false,
    featureName: '',
    onUpgrade: () => {}
  });

  const showSuccess = (message: string) => {
    setSuccessToast({ isVisible: true, message });
  };

  const showError = (message: string, variant: 'toast' | 'modal' = 'toast', title = 'Error') => {
    setErrorNotification({ isOpen: true, message, variant, title });
  };

  const showConfirmation = (
    title: string, 
    description: string, 
    onConfirm: () => void,
    variant: 'default' | 'destructive' = 'default'
  ) => {
    setConfirmation({ isOpen: true, title, description, onConfirm, variant });
  };

  const showWelcome = (onStartOnboarding = () => {}, userName = 'there') => {
    setWelcome({ isOpen: true, onStartOnboarding, userName });
  };

  const showUpgrade = (featureName: string, onUpgrade = () => {}) => {
    setUpgrade({ isOpen: true, featureName, onUpgrade });
  };

  return (
    <NotificationContext.Provider value={{
      showSuccess,
      showError,
      showConfirmation,
      showWelcome,
      showUpgrade
    }}>
      {children}
      
      <SuccessToast
        message={successToast.message}
        isVisible={successToast.isVisible}
        onClose={() => setSuccessToast({ isVisible: false, message: '' })}
      />
      
      <ErrorNotification
        message={errorNotification.message}
        isOpen={errorNotification.isOpen}
        variant={errorNotification.variant}
        title={errorNotification.title}
        onClose={() => setErrorNotification({ isOpen: false, message: '', variant: 'toast', title: 'Error' })}
      />
      
      <ConfirmationModal
        title={confirmation.title}
        description={confirmation.description}
        isOpen={confirmation.isOpen}
        variant={confirmation.variant}
        onConfirm={() => {
          confirmation.onConfirm();
          setConfirmation({ isOpen: false, title: '', description: '', onConfirm: () => {}, variant: 'default' });
        }}
        onCancel={() => setConfirmation({ isOpen: false, title: '', description: '', onConfirm: () => {}, variant: 'default' })}
      />
      
      <WelcomeModal
        isOpen={welcome.isOpen}
        userName={welcome.userName}
        onStartOnboarding={() => {
          welcome.onStartOnboarding();
          setWelcome({ isOpen: false, onStartOnboarding: () => {}, userName: 'there' });
        }}
        onClose={() => setWelcome({ isOpen: false, onStartOnboarding: () => {}, userName: 'there' })}
      />
      
      <UpgradeModal
        isOpen={upgrade.isOpen}
        featureName={upgrade.featureName}
        onUpgrade={() => {
          upgrade.onUpgrade();
          setUpgrade({ isOpen: false, featureName: '', onUpgrade: () => {} });
        }}
        onClose={() => setUpgrade({ isOpen: false, featureName: '', onUpgrade: () => {} })}
      />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
