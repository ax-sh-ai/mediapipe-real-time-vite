import clsx from 'clsx';
import { type ComponentPropsWithRef, PropsWithChildren, forwardRef } from 'react';

export function MediaSvgAnnotationOverlay({
  media,
  children
}: PropsWithChildren<{ media: PropsWithChildren['children'] }>) {
  return (
    <section className='relative block w-full'>
      <div className='w-full'>{media}</div>
      <svg
        className='absolute inset-0 w-full h-full pointer-events-none'
        preserveAspectRatio='none'
        viewBox='0 0 1 1'
      >
        {children}
      </svg>
    </section>
  );
}

export const ImageSvgAnnotationOverlay = forwardRef<
  HTMLImageElement,
  PropsWithChildren<Omit<ComponentPropsWithRef<'img'>, 'ref'>>
>(({ src, alt, className, children, ...props }, ref) => {
  return (
    <MediaSvgAnnotationOverlay
      media={
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
    </MediaSvgAnnotationOverlay>
  );
});
