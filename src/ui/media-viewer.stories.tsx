import { Detection } from '@mediapipe/tasks-vision';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useCallback, useState } from 'react';

import { useVideoFrameHook } from '../hooks/use-video-frame-hook.ts';
import { VideoWithSvgOverlay } from './video-with-svg-overlay.tsx';

function VideoViewer() {
  // const ref = useRef<ElementRef<'video'>>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const callback = useCallback(
    (video: HTMLVideoElement, detections: Detection[]) => setDetections(detections),
    []
  );
  const videoRef = useVideoFrameHook(callback);
  return (
    <div>
      <VideoWithSvgOverlay
        video={
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            controls
            src={'./video.mp4'}
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
              className={'fill-yellow-300/30 saturate-100'}
              x={originX}
              y={originY}
              width={width}
              height={height}
            />
          );
        })}
      </VideoWithSvgOverlay>
    </div>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof VideoViewer> = {
  title: 'Example/VideoViewer',
  component: VideoViewer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'fullscreen'
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' }
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button'
  }
};
//
// export const Secondary: Story = {
//   args: {
//     label: 'Button'
//   }
// };
//
// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Button'
//   }
// };
//
// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Button'
//   }
// };
