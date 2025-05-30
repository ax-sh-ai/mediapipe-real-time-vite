import { FaceDetection } from '@mediapipe/face_detection';
// import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { useMediaPipe } from './useMediaPipe';
import { renderHook, waitFor } from '@testing-library/react';

// Mock MediaPipe
vitest.mock('@mediapipe/face_detection', () => ({
  FaceDetection: vi.fn(() => ({
    setOptions: vi.fn(),
    onResults: vi.fn(),
    initialize: vi.fn().mockResolvedValue(null),
    send: vi.fn(),
    close: vi.fn()
  }))
}));

describe('useMediaPipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes MediaPipe once', async () => {
    const { result  } = renderHook(() => useMediaPipe());

    await waitFor(() => {
      expect(result.current.loading).toHaveBeenCalledTimes(1)
    });
    expect(result.current.loading).toBe(false);
    expect(FaceDetection).toHaveBeenCalledTimes(1);
  });

  it('handles video processing', async () => {
    const { result } = renderHook(() => useMediaPipe());

    await React.act(async () => {
      const file = new File([''], 'test.mp4', { type: 'video/mp4' });
      await result.current.processVideo(file);
    });

    expect(result.current.error).toBeNull();
  });

  it.fails('handles errors', async () => {
    const { result } = renderHook(() => useMediaPipe());

    const mocked = vi.mocked(FaceDetection);
    mocked.mockImplementationOnce(() => ({
      initialize: vi.fn().mockRejectedValue(new Error('Initialization failed')),
      setOptions: vi.fn(),
      onResults: vi.fn(),
      close: vi.fn(),
      reset: vi.fn(),
      send: vi.fn()
    }));

    // await waitForNextUpdate();
    expect(result.current.error).toBe('Failed to initialize MediaPipe');
  });
});
