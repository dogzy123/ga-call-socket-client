import { FC, useRef, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { useUserStore } from '../store';
import { socket } from '../socket';
import { Button } from './core/Button';

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
            className="p-2 resize-none w-full placeholder:select-none placeholder:text-[#7a4646] outline-none bg-transparent focus:bg-[#3a1212] hover:bg-[#3a1212] text-white"
            placeholder="Type something here..."
            onKeyDown={handleEnterPress}
            onChange={handleMessage}
          />
          <Button type="submit" className="w-[120px] rounded-none">
            <SendHorizontal size={32} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;
