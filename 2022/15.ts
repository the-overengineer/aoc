import { Solution } from '@core/DaySolution';
import { GenericSet } from '@core/GenericSet';
import '@core/polyfill';

type Sensor = {
    x: number;
    y: number;
    beaconX: number;
    beaconY: number;
}

function part1(lines: string[]): number {
    const sensors = lines.map(parseSensor);
    const set = new GenericSet<{ x: number; y: number }>();
    
    // Collect possible points in range
    sensors.forEach((s) => getPossiblePoints(s, 2_000_000, set));

    // Remove actual beacons
    sensors.forEach((s) => {
        const beacon = {
            x: s.beaconX,
            y: s.beaconY,
        };

        set.delete(beacon);
    });

    return set.size;
}

function getPossiblePoints(sensor: Sensor, y: number, set: GenericSet<{ x: number, y: number }>): GenericSet<{ x: number, y: number}> {
    const diffToClosest = Math.abs(sensor.x - sensor.beaconX) + Math.abs(sensor.y - sensor.beaconY);
    const diffToLine = Math.abs(sensor.y - y);
    
    if (diffToLine > diffToClosest) {
        return set;
    }

    const xRange = diffToClosest - diffToLine + 1;
    
    for (let x = sensor.x - xRange; x <= sensor.x + xRange; x++) {
        if (diffToLine + Math.abs(sensor.x - x) <= diffToClosest) {
            set.add({ x, y });
        } 
    }

    return set;
}

const pattern = /Sensor at x=([\d-]+), y=([\d-]+): closest beacon is at x=([\d-]+), y=([\d-]+)/;
function parseSensor(line: string): Sensor {
    const [_, x, y, beaconX, beaconY] = pattern.exec(line)!;

    return {
        x: x.toInt(),
        y: y.toInt(),
        beaconX: beaconX.toInt(),
        beaconY: beaconY.toInt(),
    }
}

export default Solution.lines({
    part1,
});