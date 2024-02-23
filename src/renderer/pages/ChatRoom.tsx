import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import UserList from '../components/UserList';
import ChatArea from '../components/ChatArea';
import Message, { MessageProps } from '../components/Message';
import useChatScroll from '../hooks/useChatScroll';
import { useUserStore, UserData } from '../store';
import { socket } from '../socket';
import { SystemMessage } from '../components/SystemMessage';
import { AlarmButton } from '../components/AlarmButton';

// eslint-disable-next-line react/function-component-definition
const ChatRoom: FC = () => {
  const [isRinging, setIsRinging] = useState(false);
  const [msgList, setMsgList] = useState<MessageProps[]>([]);
  const setUserData = useUserStore((state) => state.setUserData);
  const chatRef = useChatScroll(msgList);
  const { play } = useAudio('http://34.88.50.142/static/ring.wav');

  useEffect(() => {
    function handleReceiveCall() {
      window.electron.ipcRenderer.sendMessage('receive-call', []);
      play();
      setIsRinging(true);
      setTimeout(() => {
        setIsRinging(false);
      }, 2100);
    }

    function handleReceiveMsg(data: any) {
      setMsgList((prev) => [...prev, data as MessageProps]);
    }

    function handleReceiveUser(data: any) {
      setUserData(data as UserData);
    }

    socket.on('receive-alarm', handleReceiveCall);
    socket.on('receive-msg', handleReceiveMsg);
    socket.on('receive-user-data', handleReceiveUser);

    return () => {
      socket.off('receive-alarm', handleReceiveCall);
      socket.off('receive-msg', handleReceiveMsg);
      socket.off('receive-user-data', handleReceiveUser);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-[100vh]">
      <div
        className={clsx(
          'absolute pop-out-in-left top-[30%] left-[30%] -rotate-[15deg] pointer-events-none select-none',
          { hidden: !isRinging },
        )}
      >
        <span className="text-white text-9xl font-outline-2">Ring!</span>
      </div>
      <div
        className={clsx(
          'absolute pop-out-in-right top-[40%] left-[60%] rotate-[20deg] pointer-events-none select-none',
          { hidden: !isRinging },
        )}
      >
        <span className="text-white text-9xl font-outline-2">Ring!</span>
      </div>
      <div className="flex flex-row h-full">
        <div className="basis-1/4 p-4 bg-[#441111]">
          <UserList />
        </div>
        <div className="basis-3/4 flex flex-col">
          <div className="min-h-[60px] h-[60px] px-8 py-2 border-[2px] border-[#581818] border-t-0 border-r-0 bg-[#441111]">
            <div className="flex items-center h-full">
              <div>
                <h3 className="text-white">Chat room</h3>
              </div>
              <AlarmButton />
            </div>
          </div>
          <div
            ref={chatRef}
            className="grow text-white overflow-y-scroll border-l-[2px] border-[#581818]"
          >
            {msgList.map((msg, index) => {
              if (msg.type === 'system') {
                return (
                  <SystemMessage
                    key={index}
                    body={msg.body}
                    timestamp={msg.timestamp}
                  />
                );
              }

              return (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <Message key={index} {...msg} />
              );
            })}
          </div>
          <div className="min-h-[100px] h-[100px] border-[2px] border-[#581818] border-b-0 border-r-0 bg-[#441111]">
            <ChatArea />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
