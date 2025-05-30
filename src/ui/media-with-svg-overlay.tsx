import clsx from 'clsx';
import { ComponentPropsWithRef, PropsWithChildren, ReactNode, forwardRef } from 'react';

export function MediaWithSvgOverlay({ video, children }: PropsWithChildren<{ video: ReactNode }>) {
  return (
    <div className='relative inline-block w-full max-w-full'>
      {video}
      <svg className='absolute inset-0 overflow-hidden pointer-events-none'>{children}</svg>
    </div>
  );
}

export const ImageMediaWithSvgOverlay = forwardRef<
  HTMLImageElement,
  Omit<ComponentPropsWithRef<'img'>, 'ref'>
>(({ src, alt, className, children, ...props }, ref) => {
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
});
