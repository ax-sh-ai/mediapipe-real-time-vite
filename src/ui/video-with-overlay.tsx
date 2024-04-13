import { Detection } from '@mediapipe/tasks-vision';
import { ComponentProps, useCallback, useState } from 'react';

import { useVideoFrameHook } from '../hooks/use-video-frame-hook.ts';
import { boundingBoxToPolygonPoints } from '../libs/utils.tsx';
import { ExtendDetection } from '../types.ts';
import { SvgOverlay } from './svg-overlay.tsx';

export type VideoProps = ComponentProps<'video'>;
function DetectionBox(detection: ExtendDetection) {
  const polygon = boundingBoxToPolygonPoints(detection);
  return polygon;
  // return <rect x={p?.x1} y={p?.y1} width={'5'} height={'5'} />;
}
export function VideoWithOverlay(props: VideoProps) {
  const [detections, setDetections] = useState<ExtendDetection[]>([]);
  const [state, setState] = useState({ height: 0, width: 0 });
  const callback = useCallback((video: HTMLVideoElement, detections: Detection[]) => {
    const { clientWidth, clientHeight, videoWidth, videoHeight, offsetWidth, offsetHeight } = video;
    setState({ width: videoWidth, height: videoHeight });
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
      <video ref={videoRef} {...props} controls loop muted />
      <SvgOverlay height={state.height} width={state.width}>
        {detections.map((i, key) => (
          <DetectionBox {...i} key={key} />
        ))}
      </SvgOverlay>
    </div>
  );
}
