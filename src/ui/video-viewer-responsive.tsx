import { Detection } from '@mediapipe/tasks-vision';
import { useCallback, useState } from 'react';

import { DetectionCallbackArgs, useVideoFrameHook } from '../hooks/use-video-frame-hook.ts';
import { makeDetectionResponsive } from '../libs';
import { VideoWithSvgOverlay } from './video-with-svg-overlay.tsx';

export function VideoViewerResponsive({
  src,
  isResponsive = false
}: {
  src: string;
  isResponsive?: boolean;
}) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const callback = useCallback(
    ({ video, detections }: DetectionCallbackArgs) =>
      setDetections(isResponsive ? detections.map(makeDetectionResponsive(video)) : detections),
    []
  );
  const videoRef = useVideoFrameHook(callback);
  return (
    <VideoWithSvgOverlay
      video={
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          controls
          src={src}
          className='w-full h-auto block'
        />
      }
    >
      {detections.map(({ boundingBox, keypoints }) => {
        if (!boundingBox) return <></>;
        const { originX, originY, height, width, angle } = boundingBox;
        console.log(angle, keypoints, 'angle');
        return (
          <rect
            className={'stroke-yellow-300 hover:stroke-red-300 fill-transparent saturate-100'}
            x={originX}
            y={originY}
            strokeLinecap={'round'}
            width={width}
            height={height}
          />
        );
      })}
    </VideoWithSvgOverlay>
  );
}
