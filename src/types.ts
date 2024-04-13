import { Detection } from '@mediapipe/tasks-vision';

type UnionMembersDefault<U extends string, T> = {
  [K in U]: T;
};
export type ExtendDetection = Detection &
  UnionMembersDefault<
    'offsetHeight' | 'offsetWidth' | 'clientWidth' | 'clientHeight' | 'videoWidth' | 'videoHeight',
    number
  >;
