import React from 'react';
import { AppContextType } from './types';

export const AppContext = React.createContext<AppContextType | null>(null);

const AppContextProvider: React.FC<React.ReactNode> = {};
