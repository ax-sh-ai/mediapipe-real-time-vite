import { PropsWithChildren, ReactNode } from 'react';

export function VideoWithSvgOverlay({ video, children }: PropsWithChildren<{ video: ReactNode }>) {
  return (
    <div className='relative inline-block w-full max-w-full'>
      {video}
      <svg className='absolute top-0 left-0 w-full h-full overflow-hidden bg-red-300/40 pointer-events-none'>
        {children}
      </svg>
    </div>
  );
}
