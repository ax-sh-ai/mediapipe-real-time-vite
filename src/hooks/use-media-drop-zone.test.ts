import { renderHook } from '@testing-library/react';

import { useMediaDropZone } from './use-media-drop-zone.ts';

describe(useMediaDropZone.name, async () => {
  it('should initialize faceDetector to null', () => {
    const { result } = renderHook(() =>
      useMediaDropZone((acceptedFiles) => {
        console.log('TESTING', acceptedFiles);
      })
    );
    console.log(result.current);
  });
});
