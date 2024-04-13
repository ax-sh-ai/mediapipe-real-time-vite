import { ComponentProps, forwardRef, useCallback, useState } from 'react';

import { useFaceDetector } from '../hooks/use-face-detector.ts';
import { ExtendDetection } from '../types.ts';
import { VideoFrameHookCallbackArgs, useVideoFrameHook } from './use-video-frame-hook.tsx';

export type Ref = HTMLVideoElement;
export type VideoProps = ComponentProps<'video'>;

function DetectionBox(detection: ExtendDetection) {
  const polygon = boundingBoxToPolygonPoints(detection);
  return polygon;
  // return <rect x={p?.x1} y={p?.y1} width={'5'} height={'5'} />;
}

export const VideoWithFrame = forwardRef<Ref, VideoProps>((props, ref) => {
  const faceDetector = useFaceDetector();
  const [detections, setDetections] = useState<ExtendDetection[]>([]);

  const callback = useCallback(
    ({ video, timestamp, metadata }: VideoFrameHookCallbackArgs) => {
      const { detections } = faceDetector.detect(video);
      const { clientWidth, clientHeight, videoWidth, videoHeight, offsetWidth, offsetHeight } =
        video;
      setDetections(
        detections.map(
          (i) =>
            ({
              ...i,
              videoHeight,
              videoWidth,
              clientWidth,
              clientHeight,
              offsetWidth,
              offsetHeight
            }) as ExtendDetection
        )
      );
      console.log(`timestamp: ${timestamp}`);
    },
    [faceDetector]
  );
  const videoRef = useVideoFrameHook(callback);

  return (
    <div>
      <video ref={videoRef} {...props} />
      <svg
        viewBox='0 0'
        // ref={overlayRef}
        className='overlay absolute top-0 left-0 pointer-events-none'
      >
        <mask id='myMask'>
          <rect x='0' y='0' width='100%' height='100%' fill='white' />
          {detections.map((i, key) => (
            <DetectionBox {...i} key={key} />
          ))}
        </mask>
        <rect
          height={'100%'}
          width={'100%'}
          className={'filter saturate-0 opacity-50'}
          mask='url(#myMask)'
        />
      </svg>
    </div>
  );
});
