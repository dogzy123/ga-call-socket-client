import { FC, useState } from 'react';
import { BellRing } from 'lucide-react';
import { Button } from './core/Button';
import { socket } from '../socket';
import { useUserStore } from '../store';

const AlarmButton: FC = () => {
  const [alarmDisabled, setAlarmDisabled] = useState(false);
  const name = useUserStore((state) => state.name);

  const handleAlarm = () => {
    socket.emit('send-alarm', { name });
    setAlarmDisabled(true);
    setTimeout(() => {
      setAlarmDisabled(false);
    }, 2200);
  };

  return (
    <Button
      type="button"
      className="ml-auto w-[150px]"
      disabled={alarmDisabled}
      onClick={handleAlarm}
    >
      <BellRing size={16} />
      Alarm
    </Button>
  );
};

export { AlarmButton };
