import { FC } from 'react';
import clsx from 'clsx';
import { useUserStore } from '../store';
import { formatIsoToLocal } from '../utils';

export type MessageProps = {
  _id: string;
  type: 'user' | 'system';
  author: string;
  authorName: string;
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
  authorName,
  body,
  timestamp,
  media = undefined,
}) => {
  const userId = useUserStore((state) => state.id);
  const isSelf = userId === author;

  const formattedDate = formatIsoToLocal(timestamp);

  return (
    <div className="flex pr-6 hover:bg-[rgba(0,0,0,0.2)]">
      <div className="flex items-start">
        <div className="flex items-center">
          <span className="text-xs text-[#858585] min-w-[115px]">
            {formattedDate}
          </span>
          <span
            className={clsx('font-bold text-sm', { 'text-[#ff8383]': !isSelf })}
          >
            {authorName}:
          </span>
        </div>
      </div>
      <div
        style={{ wordWrap: 'break-word' }}
        className="flex flex-col ml-2 indent-0 whitespace-break-spaces overflow-hidden"
      >
        <span className="text-sm indent-0">{body}</span>
        {media && (
          <div className="flex flex-col gap-2 bg-[#581818] p-4 w-[400px] border-[1px] border-[#521515] rounded-md">
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
