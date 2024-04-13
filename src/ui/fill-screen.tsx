import clsx from 'clsx';
import { type PropsWithChildren } from 'react';

export function FillScreen({ children, className }: PropsWithChildren<{ className: string }>) {
  return (
    <section className={clsx('FillScreen min-h-dvh min-w-dvw', className)}>{children}</section>
  );
}
