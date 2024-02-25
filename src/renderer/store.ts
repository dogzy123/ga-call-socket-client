import { create } from 'zustand';

export type UserData = {
  id: string;
  name: string;
  email: string;
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
  setName: (name: string) => {
    set({ name });
  },
  setUserData: ({ id, name, email }) => {
    set({ id, name, email });
  },
}));

const useAlarmStore = create<AlarmStore>((set) => ({
  isDisabled: false,
  setIsDisabled: (isDisabled: boolean) => {
    set({ isDisabled });
  },
}));

export { useUserStore, useAlarmStore };
