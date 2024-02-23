import { FC, useEffect, useState } from 'react';
import { useUserStore, UserData } from '../store';
import { socket } from '../socket';

// eslint-disable-next-line react/function-component-definition
const UserList: FC = () => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const userId = useUserStore((state) => state.id);
  const userName = useUserStore((state) => state.name);

  useEffect(() => {
    if (userId) {
      socket.timeout(2000).emit('get-users');

      socket.on('receive-users', (data: any) => {
        const users = [...data] as UserData[];
        const newUsers = users.filter((user) => user.id !== userId);
        setUserList(newUsers);
      });
    }
  }, [userId]);

  useEffect(() => {
    // make socket.emit('get-users') every 10 seconds
    const interval = setInterval(() => {
      socket.emit('get-users');
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 bg-green-500 rounded-full" />
        <span className="text-white">{userName}</span>
      </div>
      {userList.map((user) => {
        return (
          <div key={user.id} className="flex items-center gap-2">
            <span className="h-2 w-2 bg-green-500 rounded-full" />
            <span className="text-white">{user.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
