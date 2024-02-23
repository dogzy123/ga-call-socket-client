import { FC, useRef, useState } from 'react';
import { useUserStore } from '../store';
import { socket } from '../socket';

const ChatArea: FC = () => {
  const [msgText, setMsgText] = useState<string>('');
  const userId = useUserStore((state) => state.id);
  const textareaRef = useRef<any>(null);

  const handleMessage = (e: any) => {
    setMsgText(e.target.value);
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (!msgText || msgText === '' || msgText.length === 0) return;
    socket.emit('send-msg', {
      author: userId,
      body: msgText,
      timestamp: new Date().toISOString(),
    });
    setMsgText('');
    textareaRef.current.value = '';
  };

  const handleEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="h-full">
      <form className="h-full" onSubmit={handleSendMessage}>
        <div className="flex h-full">
          <textarea
            rows={2}
            ref={textareaRef}
            className="p-2 resize-none w-full outline-none bg-transparent focus:bg-[#3a1212] hover:bg-[#3a1212] text-white"
            placeholder="Type something here..."
            onKeyDown={handleEnterPress}
            onChange={handleMessage}
          />
          <button
            type="submit"
            className="bg-red-700 w-[120px] uppercase rounded-md text-white font-semibold"
          >
            send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;
