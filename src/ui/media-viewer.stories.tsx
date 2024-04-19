import type { Meta, StoryObj } from '@storybook/react';

import { VideoViewerResponsive } from './video-viewer-responsive.tsx';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof VideoViewerResponsive> = {
  title: 'Mediapipe/VideoViewerResponsive',
  component: VideoViewerResponsive,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'fullscreen'
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes

  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { src: './video.mp4' }
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ResponsiveVideoViewer: Story = {
  args: {
    isResponsive: true
  }
};

export const NonResponsiveVideoViewer: Story = {
  args: {
    isResponsive: false
  }
};
