import { FC } from 'react';
import clsx from 'clsx';
import { useUserStore } from '../store';
import { formatIsoToLocal } from '../utils';

export type MessageProps = {
  type: 'user' | 'system';
  author: string;
  userName: string;
  body: string;
  timestamp: string;
  media:
    | {
        siteName: string;
        title: string;
        url: string;
        previewImage: {
          url: string;
          height: string;
          width: string;
          type: string;
        };
      }
    | undefined;
};

// eslint-disable-next-line react/function-component-definition
const Message: FC<MessageProps> = ({
  author,
  userName,
  body,
  timestamp,
  media = undefined,
}) => {
  const userId = useUserStore((state) => state.id);
  const isSelf = userId === author;

  const formattedDate = formatIsoToLocal(timestamp);

  return (
    <div className="flex">
      <div className="flex items-start">
        <div className="flex items-center">
          <span className="text-xs text-[#858585] min-w-[120px]">
            {formattedDate}
          </span>
          <span className={clsx('font-bold', { 'text-[#ff8383]': !isSelf })}>
            {userName}:
          </span>
        </div>
      </div>
      <div className="ml-2">
        <span className="text-pretty whitespace-normal break-words break-all">
          {body}
        </span>
        {media && (
          <div className="flex flex-col gap-2 bg-[#280e0e] p-4 w-[400px] border-[1px] border-[#521515] rounded-md">
            <a
              className="underline"
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h4>{media.title}</h4>
            </a>
            <p className="text-sm font-bold">{media.siteName}</p>
            <a href={media.url} target="_blank" rel="noopener noreferrer">
              <img alt="link" className="w-auto" src={media.previewImage.url} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
