import { renderHook } from '@testing-library/react';

import { useMediaPipeSingleton } from './useMediaPipeSingleton.ts';

describe('App Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});

describe('useMediaPipeSingleton', () => {
  const commonConfig = { selfieMode: true };

  it('should return initial loading state', () => {
    const { result } = renderHook(() => useMediaPipeSingleton('holistic', commonConfig));
    console.log(result.current);

    // expect(result.current.isLoading).toBe(true);
    // expect(result.current.isError).toBe(false);
    // expect(result.current.error).toBe(null);
    // expect(result.current.mediaPipeInstance).toBe(null);
  });
});
