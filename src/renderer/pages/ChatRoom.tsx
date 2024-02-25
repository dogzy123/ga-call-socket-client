import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import UserList from '../components/UserList';
import ChatArea from '../components/ChatArea';
import Message, { MessageProps } from '../components/Message';
import useChatScroll from '../hooks/useChatScroll';
import { socket } from '../socket';
import { SystemMessage } from '../components/SystemMessage';
import { AlarmButton } from '../components/AlarmButton';
import { server } from '../axios';

// eslint-disable-next-line react/function-component-definition
const ChatRoom: FC = () => {
  const [isRinging, setIsRinging] = useState(false);
  const [msgList, setMsgList] = useState<MessageProps[]>([]);
  const chatRef = useChatScroll(msgList);
  const { play } = useAudio('http://34.88.50.142/static/ring.wav');

  useEffect(() => {
    const getLastMessages = async () => {
      try {
        const { data } = await server.get('/api/last-messages');
        setMsgList(data?.messages as MessageProps[]);
      } catch (err) {
        console.error(err);
      }
    };

    function handleReceiveCall() {
      setIsRinging(true);
      window.electron.ipcRenderer.sendMessage('receive-call', []);
      play();
    }

    function handleReceiveMsg(data: any) {
      window.electron.ipcRenderer.sendMessage('receive-msg', []);
      setMsgList((prev) => [...prev, data as MessageProps]);
    }

    getLastMessages();

    socket.on('receive-alarm', handleReceiveCall);
    socket.on('receive-target-alarm', handleReceiveCall);
    socket.on('receive-msg', handleReceiveMsg);

    return () => {
      socket.off('receive-alarm', handleReceiveCall);
      socket.off('receive-target-alarm', handleReceiveCall);
      socket.off('receive-msg', handleReceiveMsg);
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 28px)' }}>
      <div
        className={clsx(
          'absolute pop-out-in-left top-[30%] left-[30%] -rotate-[15deg] pointer-events-none select-none',
          { hidden: !isRinging },
        )}
      >
        <span className="text-white text-9xl font-bold font-outline-2">
          Ring!
        </span>
      </div>
      <div
        onAnimationEnd={() => setIsRinging(false)}
        className={clsx(
          'absolute pop-out-in-right top-[40%] left-[60%] rotate-[20deg] pointer-events-none select-none',
          { hidden: !isRinging },
        )}
      >
        <span className="text-white text-9xl font-bold font-outline-2">
          Ring!
        </span>
      </div>
      <div className="flex flex-row h-full">
        <div className="max-w-[285px] w-full p-4 bg-[#441111]">
          <UserList />
        </div>
        <div className="w-full flex flex-col overflow-hidden">
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

              return <Message key={index} {...msg} />;
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
