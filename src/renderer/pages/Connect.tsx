import { FC, useState, ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';
import { XCircle } from 'lucide-react';
import { UserData, useUserStore } from '../store';
import { initializeSocket } from '../socket';
import { Button } from '../components/core/Button';
import { Input } from '../components/core/Input';
import { server } from '../axios';

const settings = window.settings;

const ConnectPage: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setName = useUserStore((state) => state.setName);
  const setUserData = useUserStore((state) => state.setUserData);

  function handleReceiveUser(data: any) {
    setUserData(data as UserData);
  }

  const handleConnect = async (e: any) => {
    e.preventDefault();

    if (!userName || userName.length === 0 || userName === '') {
      return;
    }

    const nickName = userName.trim().replace(/\s+/g, '-');
    setName(nickName);

    setIsLoading(true);

    try {
      const { data } = await server.post('/api/login', {
        email: userName,
        password,
      });
      if (data && data.status === 'ok') {
        window.electron.ipcRenderer.sendMessage('save-user-name', {
          name: nickName,
        });

        if (data.user) {
          handleReceiveUser(data.user);
        }

        const socket = initializeSocket(data.user.id);

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

        socket.io.on('reconnect_failed', () => {
          setIsLoading(false);
        });

        socket.io.on('reconnect', () => {
          setIsLoading(false);
          navigate('/chatroom');
        });
      }
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
        <div className="w-1/2 px-8 py-4 mt-48 rounded-xl border-[2px] border-red-700 bg-red-800">
          <form onSubmit={handleConnect}>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Enter email"
                type="text"
                value={userName}
                onChange={handleUserNameChange}
              />
              <Input
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <Button className="mt-4 py-3" disabled={isLoading} type="submit">
              Connect
            </Button>
          </form>
          <div className="mt-2">
            <Link to="/signup">
              <span className="text-sm text-white hover:underline">Sign up</span>
            </Link>
          </div>
          {error && (
            <div className="flex flex-row items-center bg-[#6c1616] p-4 rounded-md mt-4">
              <XCircle width={16} className="mr-2 text-white" />
              <span className="text-sm text-white">{error}</span>
            </div>
          )}
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
