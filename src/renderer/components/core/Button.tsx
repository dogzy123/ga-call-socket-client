import { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const Button: FC<ButtonProps> = ({
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={twMerge(
        clsx(
          'flex flex-row justify-center items-center gap-2',
          'w-full py-2 bg-red-700 rounded-md text-white font-semibold transition ease-in',
          'disabled:bg-[#891a1a] disabled:cursor-not-allowed disabled:text-[#a76a6a] hover:bg-red-600',
        ),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
