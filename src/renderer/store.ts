import { create } from 'zustand';

export type UserData = {
  id: string;
  name: string;
  email: string;
  socketId: string;
};

type UserInfoStore = UserData & {
  setName: (name: string) => void;
  setUserData: ({ id, name, email }: UserData) => void;
};

type AlarmStore = {
  isDisabled: boolean;
  setIsDisabled: (isDisabled: boolean) => void;
};

const useUserStore = create<UserInfoStore>((set) => ({
  id: '',
  name: '',
  email: '',
  socketId: '',
  setName: (name: string) => {
    set({ name });
  },
  setUserData: ({ id, name, email, socketId }) => {
    set({ id, name, email, socketId });
  },
}));

const useAlarmStore = create<AlarmStore>((set) => ({
  isDisabled: false,
  setIsDisabled: (isDisabled: boolean) => {
    set({ isDisabled });
  },
}));

export { useUserStore, useAlarmStore };
