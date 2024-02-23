import Store from 'electron-store';

const store = new Store({
  encryptionKey: 'ga-encryption-key-324423-bbbaaa',
});

const getValue = (key: string) => {
  const val = store.get(key);
  if (!val) {
    return null;
  }
  return val;
};

const setValue = (key: string, value: unknown) => {
  store.set(key, value);
  return getValue(key);
};

export { getValue, setValue };
