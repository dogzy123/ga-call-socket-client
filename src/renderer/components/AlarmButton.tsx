import { FC, useState } from 'react';
import { BellRing } from 'lucide-react';
import { Button } from './core/Button';
import { socket } from '../socket';

const AlarmButton: FC = () => {
  const [alarmDisabled, setAlarmDisabled] = useState(false);

  const handleAlarm = () => {
    socket.emit('send-alarm');
    setAlarmDisabled(true);
    setTimeout(() => {
      setAlarmDisabled(false);
    }, 2000);
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
