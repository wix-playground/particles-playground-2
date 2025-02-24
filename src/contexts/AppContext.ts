import {createContext} from 'react';
import {AppProps} from '../interfaces';

export const AppContext = createContext<AppProps | null>(null);
