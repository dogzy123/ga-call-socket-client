import clsx from 'clsx';
import { FC, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      className={twMerge(
        clsx(
          'py-3 px-4 w-full text-white bg-transparent border-[1px] rounded-md border-red-700 outline-none',
          'hover:bg-[#8f1b1b]',
          'focus:bg-[#8f1b1b] focus:border-red-800',
          'placeholder:text-[#b95656]',
          'ease-linear duration-150',
        ),
        className,
      )}
      {...props}
    />
  );
};

export { Input };
