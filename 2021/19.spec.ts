import { isEqual } from '@core/utilityBelt';
import { deepStrictEqual as eq, ok } from 'assert';
import { getScanners, point, rotations, Point3D, Scanner } from './19';

describe('day 19', () => {
    describe('rotations', () => {
        it('should include all the examples', () => {
            const exampleSrc: string = `--- scanner 0 ---
-1,-1,1
-2,-2,2
-3,-3,3
-2,-3,1
5,6,-4
8,0,7

--- scanner 0 ---
1,-1,1
2,-2,2
3,-3,3
2,-1,3
-5,4,-6
-8,-7,0

--- scanner 0 ---
-1,-1,-1
-2,-2,-2
-3,-3,-3
-1,-3,-2
4,6,5
-7,0,8

--- scanner 0 ---
1,1,-1
2,2,-2
3,3,-3
1,3,-2
-4,-6,5
7,0,8

--- scanner 0 ---
1,1,1
2,2,2
3,3,3
3,1,2
-6,-4,-5
0,7,-8`;
            const scanners = getScanners(exampleSrc);

            const transformed = rotations(scanners[0]);

            for (const s of scanners) {
                const match = transformed.find((t) => isEqual(t.scans, s.scans));

                if (match == null) {
                    const repr = s.scans.map((s) => `${s.x},${s.y},${s.z}`).join('\n');

                    throw new Error(`Missing:
${repr}`);
                }

                ok(match);
            }
        });
    });
})