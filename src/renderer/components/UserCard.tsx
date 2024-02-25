import { FC } from 'react';
import clsx from 'clsx';
import { BellRing } from 'lucide-react';
import { useAlarmStore, useUserStore } from '../store';
import { socket } from '../socket';

type UserCardProps = {
  userName: string;
  userId?: string;
  socketId?: string;
  isOnline?: boolean;
};

const UserCard: FC<UserCardProps> = ({
  userName,
  userId = undefined,
  isOnline = false,
  socketId = '',
}) => {
  const clientUserId = useUserStore((state) => state.id);
  const { isDisabled, setIsDisabled } = useAlarmStore((state) => state);
  const isSelf = clientUserId === userId;
  const shouldRender = !isSelf && isOnline && userId !== undefined;

  const handleTargetAlarm = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDisabled(true);
    socket.emit('send-target-alarm', {
      sender: {
        id: clientUserId,
      },
      target: {
        id: userId,
        socketId,
      },
    });
    setTimeout(() => {
      setIsDisabled(false);
    }, 2200);
  };

  return (
    <div
      className={clsx(
        'flex z-10 relative group items-center gap-2 p-2 rounded-md select-none cursor-pointer hover:bg-[#703333]',
        { 'active:bg-[#873f3f]': isOnline },
      )}
    >
      <span
        className={clsx(
          'h-2 w-2 rounded-full',
          { 'bg-green-500': isOnline },
          { 'bg-gray-500': !isOnline },
        )}
      />
      <span
        className={clsx(
          { 'text-white': isOnline },
          { 'text-[rgba(255,255,255,0.3)] group-hover:text-white': !isOnline },
        )}
      >
        {userName}
      </span>
      {shouldRender && (
        <div className="hidden user z-20 pointer-events-auto group-hover:flex absolute top-1/2 -translate-y-1/2 right-[16px] text-white">
          <button
            onClick={handleTargetAlarm}
            disabled={isDisabled}
            className="rounded-md p-2 bg-red-700 disabled:bg-[#891a1a] disabled:cursor-not-allowed disabled:text-[#a76a6a]"
          >
            <BellRing size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export { UserCard };
