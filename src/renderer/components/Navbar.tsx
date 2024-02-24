import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

const Navbar = () => {
  const handleMinimize = () => {
    window.electron.ipcRenderer.sendMessage('manualMinimize');
  };

  const handleMaximize = () => {
    window.electron.ipcRenderer.sendMessage('manualMaximize');
  };

  const handleExit = () => {
    window.electron.ipcRenderer.sendMessage('manualExit');
  };

  return (
    <nav
      className={clsx(
        'h-[28px] w-full select-none border-b-[2px] border-[#581818] bg-[#220505]',
        'flex items-center',
      )}
    >
      <div id="title-bar" className="w-full">
        <span className="ml-3 text-xs select-none font-medium text-[#c58a8a]">
          Garena Alarm
        </span>
      </div>
      <div className="flex items-center h-full text-white">
        <button onClick={handleMinimize} className="flex items-center bg-transparent px-2 h-full cursor-pointer hover:bg-gray-700">
          <FontAwesomeIcon icon={faMinus} size="sm" />
        </button>
        <button onClick={handleMaximize} className="flex items-center bg-transparent px-2 h-full cursor-pointer hover:bg-gray-700">
          <FontAwesomeIcon icon={faSquare} size="sm" />
        </button>
        <button onClick={handleExit} className="flex items-center bg-transparent px-2 h-full cursor-pointer hover:bg-red-600">
          <FontAwesomeIcon icon={faXmark} size="1x" />
        </button>
      </div>
    </nav>
  );
};

export { Navbar };
