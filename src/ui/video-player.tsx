import { ElementRef, useRef } from 'react';

import { VideoWithFrame } from './video-with-frame.tsx';

export function VideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<ElementRef<'video'>>(null);

  return (
    <div className={'relative'} style={{ clipPath: 'polygon(174,154 174,262 282,262 282,154)' }}>
      <VideoWithFrame ref={videoRef} src={url} controls loop muted />
    </div>
  );
}
