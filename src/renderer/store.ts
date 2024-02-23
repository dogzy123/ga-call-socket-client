import { create } from 'zustand';

export type UserData = {
  id: string;
  name: string;
  email: string;
};

type UserInfo = UserData & {
  setName: (name: string) => void;
  setUserData: ({ id, name, email }: UserData) => void;
};

const useUserStore = create<UserInfo>((set) => ({
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

export { useUserStore };
