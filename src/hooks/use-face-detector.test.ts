import { renderHook } from '@testing-library/react';

import { useFaceDetector } from './use-face-detector';

describe('Renders main page correctly', async () => {
  it('Should render hook correctly', async () => {
    const { result } = renderHook(() => useFaceDetector());
    expect(result.current).toBeDefined();
  });
});
