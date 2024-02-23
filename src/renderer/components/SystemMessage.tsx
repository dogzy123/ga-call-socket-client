import { FC } from 'react';
import { formatIsoToLocal } from '../utils';

type SystemMessageProps = {
  body: string;
  timestamp: string;
};

// eslint-disable-next-line react/function-component-definition
const SystemMessage: FC<SystemMessageProps> = ({ body, timestamp }) => {
  const formattedDate = formatIsoToLocal(timestamp);

  return (
    <div className="flex">
      <div className="flex items-start">
        <div className="flex items-center">
          <span className="text-xs text-[#858585] min-w-[120px]">
            {formattedDate}
          </span>
          <span className="text-xs text-[#858585] mr-1">
            System notification:
          </span>
          <span className="text-xs text-[#858585] text-pretty whitespace-normal break-words break-all">
            {body}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemMessage;
