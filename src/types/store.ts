import { CurrentUser } from './user';

export interface ApiKeyReducer {
  apiKey: string;
  loggingEnabled: boolean;
  theme: 'light' | 'dark';
  totalTimeLoggedToday: string;
}

export interface ReduxSelector {
  config: ApiKeyReducer;
  currentUser: CurrentUser;
}
