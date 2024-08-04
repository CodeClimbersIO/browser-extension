export interface ConfigReducer {
  loggingEnabled: boolean
  theme: 'light' | 'dark'
  totalTimeLoggedToday: string
}

export interface ReduxSelector {
  config: ConfigReducer
}
