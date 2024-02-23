import { FC, useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { PuffLoader } from 'react-spinners';
import { UserData, useUserStore } from '../store';
// eslint-disable-next-line import/named
import { initializeSocket } from '../socket';
import { Button } from '../components/core/Button';

const settings = window.settings;

const ConnectPage: FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setName = useUserStore((state) => state.setName);
  const setUserData = useUserStore((state) => state.setUserData);

  function handleReceiveUser(data: any) {
    setUserData(data as UserData);
  }

  const handleConnect = async (e: any) => {
    e.preventDefault();

    if (
      !userName ||
      userName.length === 0 ||
      userName === '' ||
      userName.length > 20
    ) {
      return;
    }

    const nickName = userName.trim().replace(/\s+/g, '-');
    setName(nickName);

    setIsLoading(true);

    window.electron.ipcRenderer.sendMessage('save-user-name', {
      name: nickName,
    });

    const socket = initializeSocket(nickName);

    // try to socket connect if error then show error message
    socket.connect();

    // redirect to chatroom after 2 seconds
    socket.on('connect', () => {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/chatroom');
      }, 2000);
    });

    // redirect to home if disconnected
    socket.on('disconnect', () => {
      navigate('/');
    });

    socket.on('receive-user-data', handleReceiveUser);

    socket.io.on('reconnect_failed', () => {
      setIsLoading(false);
    });

    socket.io.on('reconnect', () => {
      setIsLoading(false);
      navigate('/chatroom');
    });
  };

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  useEffect(() => {
    const savedUserName = settings.getValue('userName');
    if (savedUserName) {
      setUserName(savedUserName as string);
    }
  }, []);

  return (
    <div className="h-[100vh]">
      <div className="flex justify-center items-center">
        <div className="w-1/2 h-60 px-8 py-4 mt-48 rounded-xl border-[2px] border-red-700 bg-red-800">
          <form onSubmit={handleConnect}>
            <div>
              <input
                placeholder="Enter your username"
                className={clsx(
                  'py-3 px-4 w-full text-white bg-transparent border-[1px] rounded-md border-red-700 outline-none',
                  'hover:bg-[#8f1b1b]',
                  'focus:bg-[#8f1b1b] focus:border-red-800',
                  'placeholder:text-[#b95656]',
                  'ease-linear duration-150',
                )}
                type="text"
                value={userName}
                onChange={handleUserNameChange}
              />
            </div>
            <Button className="mt-4 py-3" disabled={isLoading} type="submit">
              Connect
            </Button>
          </form>
          {isLoading && (
            <div className="w-full flex justify-center mt-4">
              <PuffLoader color="red" size={80} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
