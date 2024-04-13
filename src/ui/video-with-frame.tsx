import { Detection } from '@mediapipe/tasks-vision';
import { ComponentProps, forwardRef, useCallback, useState } from 'react';

import { boundingBoxToPolygonPoints } from '../libs/utils.tsx';
import { ExtendDetection } from '../types.ts';
import { SvgOverlay } from './svg-overlay.tsx';
import { useVideoFrameHook } from './use-video-frame-hook.tsx';

export type Ref = HTMLVideoElement;
export type VideoProps = ComponentProps<'video'>;

function DetectionBox(detection: ExtendDetection) {
  const polygon = boundingBoxToPolygonPoints(detection);
  return polygon;
  // return <rect x={p?.x1} y={p?.y1} width={'5'} height={'5'} />;
}

export const VideoWithFrame = forwardRef<Ref, VideoProps>((props, ref) => {
  const [detections, setDetections] = useState<ExtendDetection[]>([]);

  const callback = useCallback((video: HTMLVideoElement, detections: Detection[]) => {
    const { clientWidth, clientHeight, videoWidth, videoHeight, offsetWidth, offsetHeight } = video;
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
  }, []);
  const videoRef = useVideoFrameHook(callback);

  return (
    <div
      className={'relative h-full'}
      //style={{ clipPath: 'polygon(174,154 174,262 282,262 282,154)' }}
    >
      <video ref={videoRef} {...props} />
      <SvgOverlay>
        {detections.map((i, key) => (
          <DetectionBox {...i} key={key} />
        ))}
      </SvgOverlay>
    </div>
  );
});
