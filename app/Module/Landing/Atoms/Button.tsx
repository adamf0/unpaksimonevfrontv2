'use client';

import BaseButton from '@/app/Module/Common/Components/Atoms/Button';
import clsx from 'clsx';

export default function Button({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <BaseButton
      {...props}
      className={clsx(`px-4 py-2 rounded-xl transition`, className)}
    >
      {children}
    </BaseButton>
  );
}