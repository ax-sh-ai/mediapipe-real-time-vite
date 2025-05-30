import clsx from 'clsx';
import { ComponentPropsWithRef, PropsWithChildren, ReactNode } from 'react';

export function MediaWithSvgOverlay({ video, children }: PropsWithChildren<{ video: ReactNode }>) {
  return (
    <div className='relative inline-block w-full max-w-full'>
      {video}
      <svg className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        {children}
      </svg>
    </div>
  );
}

export function ImageMediaWithSvgOverlay({
  ref,
  src,
  alt,
  className,
  children,
  ...props
}: ComponentPropsWithRef<'img'>) {
  return (
    <MediaWithSvgOverlay
      video={
        <img
          ref={ref}
          alt={alt}
          src={src}
          className={clsx('ImageMediaWithSvgOverlay w-full h-auto block', className)}
          {...props}
        />
      }
    >
      {children}
    </MediaWithSvgOverlay>
  );
}
