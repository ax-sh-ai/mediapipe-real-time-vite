import type { Meta, StoryObj } from '@storybook/react-vite';

import { ImageViewerResponsive } from './image-viewer-responsive.tsx';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ImageViewerResponsive> = {
  title: 'Mediapipe/Image Annotation',
  component: ImageViewerResponsive,
  parameters: {
    layout: 'fullscreen'
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes

  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { src: './img_1.png' }
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ResponsiveImageViewer: Story = {};
