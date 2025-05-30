// src/hooks/useHolisticSingleton.ts

import { useEffect, useState, useRef, useCallback } from 'react';
import { Holistic, Results } from '@mediapipe/holistic'; // Import for types

// This object lives outside of any React component.
// It's the "single source of truth" for our MediaPipe instance.
const globalHolisticStore = {
  instance: null as Holistic | null, // The actual MediaPipe Holistic instance
  refCount: 0, // How many components are currently using it
  isInitializing: false, // Is someone already trying to start it up?
  initializationPromise: null as Promise<Holistic> | null, // To wait for existing init
};

// --- Helper for creating the Holistic instance ---
// This is separated just to keep the hook cleaner, but it's part of the singleton logic.
async function createHolisticInstance(config: any): Promise<Holistic> {
  console.log('Holistic: Starting up the coffee machine...');
  const holistic = new Holistic({
    // MediaPipe needs to know where its model files are.
    // This is a common CDN path.
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`;
    },
  });

  // Apply any user-provided configuration
  holistic.setOptions(config);

  // Some MediaPipe solutions need an explicit initialize call, others don't.
  // Holistic usually doesn't, but it's good practice for general MediaPipe hooks.
  // if (typeof holistic.initialize === 'function') {
  //   await holistic.initialize(); // Not strictly needed for Holistic, but shown for completeness
  // }

  console.log('Holistic: Coffee machine is ready!');
  return holistic;
}

// 2. The React Hook Itself (`useHolisticSingleton`)
export function useHolisticSingleton(
  config: { [key: string]: any } = {},
  onResults?: (results: Results) => void // Callback for when MediaPipe has results
) {
  const [mediaPipeInstance, setMediaPipeInstance] = useState<Holistic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // This ref stores the LATEST `onResults` callback.
  // WHY? Because the `onResults` function might change if your component re-renders
  // and the callback depends on state. We want MediaPipe to always call the
  // most up-to-date function without us having to re-configure MediaPipe itself.
  const latestOnResultsRef = useRef(onResults);
  useEffect(() => {
    latestOnResultsRef.current = onResults; // Keep this ref updated
  }, [onResults]);

  useEffect(() => {
    // 3. Who's Using It? (Reference Counting)
    globalHolisticStore.refCount++; // Someone just asked for coffee!

    const initializeOrGetHolistic = async () => {
      // Check if the coffee machine is already starting up or ready
      if (globalHolisticStore.instance) {
        // It's already ready, just use it!
        setMediaPipeInstance(globalHolisticStore.instance);
        setIsLoading(false);
      } else if (globalHolisticStore.isInitializing) {
        // Someone else is already turning it on, wait for them.
        setIsLoading(true);
        try {
          const instance = await globalHolisticStore.initializationPromise;
          setMediaPipeInstance(instance);
          setIsLoading(false);
        } catch (err: any) {
          setError(err);
          setIsLoading(false);
          console.error('Holistic: Failed to initialize (another component already failed).', err);
        }
      } else {
        // No one's started it yet, so I'll do it!
        globalHolisticStore.isInitializing = true;
        setIsLoading(true);
        setError(null);

        globalHolisticStore.initializationPromise = createHolisticInstance(config)
          .then((instance) => {
            globalHolisticStore.instance = instance; // Store the single instance
            globalHolisticStore.isInitializing = false;
            return instance;
          })
          .catch((err) => {
            globalHolisticStore.isInitializing = false;
            globalHolisticStore.instance = null; // Clear instance on error
            globalHolisticStore.initializationPromise = null; // Clear promise on error
            console.error('Holistic: Error starting coffee machine!', err);
            throw err; // Re-throw to propagate to callers
          });

        try {
          const instance = await globalHolisticStore.initializationPromise;
          setMediaPipeInstance(instance);
          setIsLoading(false);
        } catch (err: any) {
          setError(err);
          setIsLoading(false);
        }
      }

      // Once we have an instance (either new or existing), attach the onResults handler.
      // WHY `latestOnResultsRef.current`? See explanation above.
      if (globalHolisticStore.instance) {
        globalHolisticStore.instance.onResults = (results: Results) => {
          latestOnResultsRef.current?.(results);
        };
      }
    };

    initializeOrGetHolistic();

    // 4. Cleaning Up (When My Component Stops Using It)
    return () => {
      globalHolisticStore.refCount--; // I'm done with the coffee machine!

      // If NO ONE else is using it, turn it off.
      if (globalHolisticStore.refCount === 0 && globalHolisticStore.instance) {
        console.log('Holistic: Last person leaving, turning off the coffee machine...');
        globalHolisticStore.instance.close(); // Dispose of the MediaPipe instance
        globalHolisticStore.instance = null; // Clear it out
        globalHolisticStore.isInitializing = false;
        globalHolisticStore.initializationPromise = null;
        setError(null); // Reset error state as well
      }
    };
  }, [JSON.stringify(config)]); // Only re-run effect if config changes (like modelComplexity)

  return { mediaPipeInstance, isLoading, error };
}