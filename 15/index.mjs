#!/usr/bin/env node
import fs from "fs";


function parseReading(input) {
    return input.split("\n").map(line => {
        const found = line.match(/^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/);
        if (found) {
            return {
                sensor: {x: parseInt(found[1]), y: parseInt(found[2])},
                beacon: {x: parseInt(found[3]), y: parseInt(found[4])}
            };
        }
        throw new Error("fail to parse line: " + line)
    });
}


function manhattanDistance(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

const withDistance = ({sensor, beacon}) => ({sensor, beacon, distance: manhattanDistance(sensor, beacon)});

function calcXsInRange(lineY, sensor, distance) {
    const remainingDistance = distance - Math.abs(sensor.y - lineY)
    return [
        sensor.x - remainingDistance,
        sensor.x + remainingDistance
    ];
}

function day15(input, lineY) {
    const readings = parseReading(input);
    const readingsWithDistance = readings.map(withDistance);
    const inReachForOtherBeacon = {};
    const beacons = {};
    for (const {sensor, beacon, distance} of readingsWithDistance) {
        if (beacon.y === lineY) {
            beacons[beacon.x] = false;
        }
        const [x1, x2] = calcXsInRange(lineY, sensor, distance);
        for (let x = x1; x < x2 + 1; x++) {
            inReachForOtherBeacon[x] = true;
        }
    }
    const forSureWithoutBeacon = Object.entries({...inReachForOtherBeacon, ...beacons})
        .filter(([x, noBeacon]) => (noBeacon === true))
        .map(([x]) => x);
    // console.log(forSureWithoutBeacon.map(n => parseInt(n)).sort((a, b) => a - b));
    return forSureWithoutBeacon.length;
}


function isInRange(x, y, sensor, distance) {
    return Math.abs(x - sensor.x) + Math.abs(y - sensor.y) <= distance;
}

function isPointInRangeForAnySensor(x, y, readingsWithDistance) {
    return readingsWithDistance.some(({sensor, distance}) => isInRange(x, y, sensor, distance));
}

function bruteForceSolution(maxCoordinates, readingsWithDistance) {
    for (let x = 0; x < 400; x++) {
        for (let y = 0; y < maxCoordinates; y++) {
            if (!isPointInRangeForAnySensor(x, y, readingsWithDistance)) {
                console.log({x, y});
                return x * 4_000_000 + y;
            }
        }
    }
}

function generatePointsInLine(start, end) {
    if (Math.abs(end.x - start.x) !== Math.abs(end.y - start.y)) throw new Error("TODO")
    const d = Math.abs(end.x - start.x);
    const xSing = Math.sign(end.x - start.x);
    const ySing = Math.sign(end.y - start.y);
    return Array.from({length: d})
        .map((_, n) => (
            {
                x: start.x + n * xSing,
                y: start.y + n * ySing
            }
        ));
}

const BE_SMART = true;

function day15Part2(input, maxCoordinates) {
    const readings = parseReading(input);
    const readingsWithDistance = readings.map(withDistance).sort((a, b) => b.distance - a.distance).reverse();
    if (BE_SMART) {
        // only consider points just outside edge
        for (const {sensor: s, distance: d} of readingsWithDistance) {
            const bottom2Right = generatePointsInLine(
                {x: s.x, y: s.y + d + 1},
                {x: s.x + d + 1, y: s.y}
            );
            const right2Top = generatePointsInLine(
                {x: s.x + d + 1, y: s.y},
                {x: s.x, y: s.y - d - 1}
            );
            const top2Left = generatePointsInLine(
                {x: s.x, y: s.y - d - 1},
                {x: s.x - d - 1, y: s.y}
            );
            const leftToBottom = generatePointsInLine(
                {x: s.x - d - 1, y: s.y},
                {x: s.x, y: s.y + d + 1}
            );
            for (const {x, y} of [
                ...bottom2Right,
                ...right2Top,
                ...top2Left,
                ...leftToBottom,
            ]) {
                if (0 <= x && x <= maxCoordinates && 0 <= y && y <= maxCoordinates) {
                    if (!isPointInRangeForAnySensor(x, y, readingsWithDistance)) {
                        console.log({x, y});
                        return x * 4_000_000 + y;
                    }
                }
            }
        }
    } else {
        return bruteForceSolution(maxCoordinates, readingsWithDistance);
    }
}


let input;
try {
    input = fs.readFileSync(process.argv[2], "utf8");
} catch (e) {
    console.log("Please specify file that exists");
    process.exit();
}
let lineY;
try {
    lineY = parseInt(process.argv[3]);
} catch (e) {
    console.log("Please specify line Y to consider");
    process.exit();
}
let maxCoordinates;
try {
    maxCoordinates = parseInt(process.argv[4]);
} catch (e) {
    console.log("Please specify maximal coordinates to consider");
    process.exit();
}
console.log("Part1:");
console.log(day15(input, lineY));
console.log("Part2:");
console.log(day15Part2(input, maxCoordinates));
