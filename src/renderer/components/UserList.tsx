import { FC, useEffect, useState } from 'react';
import { useUserStore, UserData } from '../store';
import { socket } from '../socket';
import { UserCard } from './UserCard';

const UserList: FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<UserData[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<UserData[]>([]);
  const userId = useUserStore((state) => state.id);
  const userName = useUserStore((state) => state.name);

  useEffect(() => {
    if (userId) {
      socket.timeout(2000).emit('get-users');

      socket.on(
        'receive-users',
        (data: { online: UserData[]; offline: UserData[] }) => {
          const { online, offline } = data;
          console.log(online, offline);
          const newUsers = online.filter((user) => user.id !== userId);
          setOnlineUsers(newUsers);
          setOfflineUsers(offline);
        },
      );
    }
  }, [userId]);

  return (
    <div className="flex flex-col">
      <UserCard userName={userName} isOnline />
      {onlineUsers.map((user) => {
        return (
          <UserCard
            key={user.id}
            userId={user.id}
            userName={user.name}
            socketId={user.socketId}
            isOnline
          />
        );
      })}
      {offlineUsers.map((user) => {
        return <UserCard key={user.id} userName={user.name} />;
      })}
    </div>
  );
};

export default UserList;
