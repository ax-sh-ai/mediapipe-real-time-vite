import { Polygon } from '@visx/shape';

import { ExtendDetection } from '../types.ts';

export function boundingBoxToStyle({
                                     boundingBox,
                                     videoWidth,
                                     videoHeight,
                                     clientHeight,
                                     clientWidth
                                   }: ExtendDetection) {
  if (!boundingBox) return {};
  const { originY, originX, height, width } = boundingBox;
  const ratioX = videoWidth / clientWidth;
  const ratioY = videoHeight / clientHeight;
  const [x1, y1] = [originY * ratioY, originX * ratioX];
  const x2 = (height + originY) * ratioX;
  const y2 = (width + originX) * ratioY;

  const points = `
                  ${x1},${y1} 
                  ${y1},${x1} 
                  ${x2},${y1}
                  ${x2},${y2} 
              `;
  return points;
  return { top: y1, left: x1, height: originY - y2, width: originX - x2 };
}

function polygonToPathData(points: [number, number][]) {
  const pathData: string[] = [];
  pathData.push(`M ${points[0][0]},${points[0][1]}`); // Move to the first point

  // Draw lines to the remaining points
  for (let i = 1; i < points.length; i++) {
    pathData.push(`L ${points[i][0]},${points[i][1]}`);
  }

  pathData.push('Z'); // Close the path

  return pathData.join(' ');
}
// @documentation
// `clientHeight` = the height of an element + the vertical padding.
// `offsetHeight` = the height of the element + the vertical padding + the top and bottom borders + the horizontal scrollbar (if it's available).
export function boundingBoxToPolygonPoints({
                                             boundingBox,
                                             videoWidth,
                                             videoHeight,

                                             clientWidth,
                                             offsetHeight,
                                             clientHeight,
                                             offsetWidth
                                           }: ExtendDetection) {
  if (!boundingBox) return null;
  const { originY, originX, height, width } = boundingBox;
  const ratioX = clientWidth / videoWidth;
  const ratioY = offsetHeight / videoHeight;
  const [x1, y1] = [originX * ratioX, originY * ratioY];
  const [x2, y2] = [(width + originX) * ratioX, (height + originY) * ratioY];
  const points = [
    [x1, y1],
    [x1, y2],
    [x2, y2],
    [x2, y1]
  ] satisfies [number, number][];
  const pathData = polygonToPathData(points);
  return <path fill={'black'} d={pathData} />;
  // return (
  //   <Polygon
  //     fill='black'
  //     points={points}
  //     // className={'fill-green-300/60 stroke-red-300 filter hue-rotate-180 opacity-50 rounded-full'}
  //   />
  // );
}
