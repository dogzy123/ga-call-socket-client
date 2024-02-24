import { FC } from 'react';
import { formatIsoToLocal } from '../utils';

type SystemMessageProps = {
  body: string;
  timestamp: string;
};

const SystemMessage: FC<SystemMessageProps> = ({ body, timestamp }) => {
  const formattedDate = formatIsoToLocal(timestamp);

  return (
    <div className="flex">
      <div className="flex items-start">
        <div className="flex items-center">
          <span className="text-xs text-[#858585] min-w-[115px]">
            {formattedDate}
          </span>
          <span className="text-xs text-[#858585] mr-1">System:</span>
          <span className="text-xs text-[#858585] text-pretty whitespace-normal break-words break-all">
            {body}
          </span>
        </div>
      </div>
    </div>
  );
};

export { SystemMessage };
