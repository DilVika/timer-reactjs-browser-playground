export enum LogType {
  TIMER = 'TIMER',
  BROWSER = 'BROWSER',
  INFO = 'INFO',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface LogEntry {
  timestamp: Date;
  type: LogType;
  message: string;
}
