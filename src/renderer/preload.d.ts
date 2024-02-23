import { ElectronHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    settings: {
      getValue: (key: string) => unknown;
      setValue: (key: string, value: unknown) => void;
    };
  }
}

export {};
