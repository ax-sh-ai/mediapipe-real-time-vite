import { ElementRef, useCallback, useRef, useState } from 'react';

import { useFaceDetector } from '../hooks/use-face-detector.ts';
import { ExtendDetection } from '../types.ts';

function useVideoHook() {
  const faceDetector = useFaceDetector();
  const videoRef = useRef<ElementRef<'video'>>(null);
  const overlayRef = useRef<ElementRef<'svg'>>(null);
  const [detections, setDetections] = useState<ExtendDetection[]>([]);

  const renderLoop = useCallback(() => {
    console.log(faceDetector.detect(videoRef.current, 1), 333);
  }, [faceDetector]);
  return { videoRef, overlayRef, detections };
}

export function VideoPlayer({ url }: { url: string }) {
  const { videoRef, overlayRef } = useVideoHook();
  return (
    <div className={'relative'} style={{ clipPath: 'polygon(174,154 174,262 282,262 282,154)' }}>
      <video ref={videoRef} src={url} controls loop muted />
      <svg
        viewBox='0 0'
        ref={overlayRef}
        className='overlay absolute top-0 left-0 pointer-events-none'
      ></svg>
    </div>
  );
}
