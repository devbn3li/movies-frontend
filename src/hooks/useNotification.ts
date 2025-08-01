import toast from 'react-hot-toast';

export const useNotification = () => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showWarning = (message: string) => {
    toast(message, {
      icon: '⚠️',
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
