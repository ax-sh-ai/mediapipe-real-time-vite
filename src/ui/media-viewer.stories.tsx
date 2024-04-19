import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PropsWithChildren } from 'react';

import videoSrc from './video.mp4';

export function VideoWithOverlayLayers({ src, children }: PropsWithChildren<{ src: string }>) {
  return (
    <div className='relative inline-block w-full max-w-full'>
      <video loop muted playsInline controls src={src} className='w-full h-auto block' />
      <svg className='absolute top-0 left-0 w-full h-full overflow-hidden bg-red-300/40 pointer-events-none'>
        {children}
      </svg>
    </div>
  );
}

function VideoViewer() {
  return (
    <div>
      <VideoWithOverlayLayers src={videoSrc}>a</VideoWithOverlayLayers>
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
