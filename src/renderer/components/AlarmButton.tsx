import { FC } from 'react';
import { BellRing } from 'lucide-react';
import { Button } from './core/Button';
import { socket } from '../socket';
import { useAlarmStore, useUserStore } from '../store';

const AlarmButton: FC = () => {
  const { isDisabled, setIsDisabled } = useAlarmStore((state) => state);
  const name = useUserStore((state) => state.name);

  const handleAlarm = () => {
    socket.emit('send-alarm', { name });
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 2200);
  };

  return (
    <Button
      type="button"
      className="ml-auto w-[150px]"
      disabled={isDisabled}
      onClick={handleAlarm}
    >
      <BellRing size={16} />
      Alarm
    </Button>
  );
};

export { AlarmButton };
