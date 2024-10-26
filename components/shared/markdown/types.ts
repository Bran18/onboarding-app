export type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip';

export interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}