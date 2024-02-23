import { create } from 'zustand';

export type UserData = {
  id: string;
  name: string;
};

type UserInfo = UserData & {
  setName: (name: string) => void;
  setUserData: ({ id, name }: UserData) => void;
};

const useUserStore = create<UserInfo>((set) => ({
  id: '',
  name: '',
  setName: (name: string) => {
    set({ name });
  },
  setUserData: ({ id, name }) => {
    set({ id, name });
  },
}));

export { useUserStore };
