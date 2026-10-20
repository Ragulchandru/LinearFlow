import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/appContextTypes';

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context as unknown as AppContextType;
};
