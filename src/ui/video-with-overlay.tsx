import { ComponentProps, useCallback, useState } from 'react';

import { DetectionCallbackArgs, useVideoFrameHook } from '../hooks/use-video-frame-hook.ts';
import { boundingBoxToPolygonPoints } from '../libs/utils.tsx';
import { ExtendDetection } from '../types.ts';
import { SvgOverlay } from './svg-overlay.tsx';

export type VideoProps = ComponentProps<'video'>;
function DetectionBox(detection: ExtendDetection) {
  const pathData = boundingBoxToPolygonPoints(detection)!;
  // @ts-ignore
  if (detection.colorful) {
    return (
      <path
        fill={'transparent'}
        d={pathData}
        id='Path_611'
        stroke={'#10c020'}
        data-name='Path 611'
        transform='translate(1.502 -10.892)'
        strokeWidth={4}
        strokeLinecap='round'
      />
    );
  }

  return (
    <path
      fill={'black'}
      d={pathData}
      id='Path_611'
      stroke={'green'}
      data-name='Path 611'
      transform='translate(1.502 -10.892)'
      strokeWidth={4}
      // fill='#FFFFFF'
    />
  );

  // return <rect x={p?.x1} y={p?.y1} width={'5'} height={'5'} />;
}
export function VideoWithOverlay(props: VideoProps) {
  const [detections, setDetections] = useState<ExtendDetection[]>([]);
  const [state, setState] = useState({ height: 0, width: 0 });
  const callback = useCallback(({ video, detections }: DetectionCallbackArgs) => {
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
