#!/usr/bin/env node
import 'core-js/actual/array/group.js';
import fs from "fs";

function parseScan(input) {
    return input
        .split("\n")
        .filter(Boolean)
        .map(line => line
            .split(",")
            .map(v => parseInt(v, 10)));
}

function listSides([x, y, z]) {
    return [
        [[x, y, z], /**/[x + 1, y + 1, z + 0]],
        [[x, y, z + 1], [x + 1, y + 1, z + 1]],
        [[x, y, z], /**/[x + 1, y + 0, z + 1]],
        [[x, y + 1, z], [x + 1, y + 1, z + 1]],
        [[x, y, z], /**/[x + 0, y + 1, z + 1]],
        [[x + 1, y, z], [x + 1, y + 1, z + 1]],
    ];
}

function measureSurfaceArea(unitaryCubes) {
    return Object.entries(
        unitaryCubes
            .flatMap(cube => listSides(cube))
            .map(([start, end]) => ([...start, ...end].join(",")))
            .group(item => item)
    )
        .filter(([_key, values]) => (values.length === 1))
        .length
}

function findBoundingBox(unitaryCubes) {
    let [xMin, xMax, yMin, yMax, zMin, zMax] = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];
    for (const unitaryCube of unitaryCubes) {
        xMin = Math.min(xMin, unitaryCube[0]);
        xMax = Math.max(xMax, unitaryCube[0] + 1);
        yMin = Math.min(yMin, unitaryCube[1]);
        yMax = Math.max(yMax, unitaryCube[1] + 1);
        zMin = Math.min(zMin, unitaryCube[2]);
        zMax = Math.max(zMax, unitaryCube[2] + 1);
    }
    return [xMin, xMax, yMin, yMax, zMin, zMax]
}


function deduplicate(cubes) {
    return [
        ...new Set(
            cubes.map(point => (point.join(",")))
        )
    ].map(cube => cube
        .split(",")
        .map(v => parseInt(v)
        )
    );
}

function findWaterUnitaryCubes([xMin, xMax, yMin, yMax, zMin, zMax], lavaUnitaryCubes) {
    const lavaCubsSet = new Set(lavaUnitaryCubes.map(point => (point.join(","))));

    function isLava(cube) {
        return lavaCubsSet.has(cube.join(","));
    }

    function isInRange([x, y, z]) {
        return xMin <= x && x < xMax
            && yMin <= y && y < yMax
            && zMin <= z && z < zMax;
    }

    const waterUnitaryCubes = new Set();

    function isKnownWater(cube) {
        return waterUnitaryCubes.has(cube.join(","));
    }

    function findEmptyAdjacentCubes([x, y, z]) {
        return [
            [x - 1, y, z],
            [x + 1, y, z],
            [x, y - 1, z],
            [x, y + 1, z],
            [x, y, z - 1],
            [x, y, z + 1],
        ].filter(cube => isInRange(cube) && !isKnownWater(cube) && !isLava(cube));
    }

    let newWaterUnitaryCubes = [[xMin, yMin, zMin]];
    while (newWaterUnitaryCubes.length) {
        newWaterUnitaryCubes.forEach(point => waterUnitaryCubes.add(point.join(",")));
        newWaterUnitaryCubes = deduplicate(newWaterUnitaryCubes.flatMap(cube => findEmptyAdjacentCubes(cube)));
    }
    return [...waterUnitaryCubes].map(pointStr => pointStr.split(",").map(v => parseInt(v)));
}

function sortPoints(a, b) {
    if (a[0] === b[0]) {
        if (a[1] === b[1]) {
            return a[2] - b[2];
        }
        return a[1] - b[1];
    }
    return a[0] - b[0];
}

function day18(input) {
    const cubes = parseScan(input);
    return measureSurfaceArea(cubes);
}

function day18Part2(input) {
    const lavaUnitaryCubes = parseScan(input).sort(sortPoints);
    // find lava bounding cube
    let [xMin, xMax, yMin, yMax, zMin, zMax] = findBoundingBox(lavaUnitaryCubes);

    // consider space one bigger in each direction that bounding cube
    [xMin, xMax, yMin, yMax, zMin, zMax] = [xMin - 1, xMax + 1, yMin - 1, yMax + 1, zMin - 1, zMax + 1];

    // starting at one of the corners recursive consider if watter can touch adjacent coordinated, keep water unitary cubes in memory
    const waterUnitaryCubes = findWaterUnitaryCubes([xMin, xMax, yMin, yMax, zMin, zMax], lavaUnitaryCubes);

    // count area for watter and subtract watter outside area
    const watterSurfaceArea = measureSurfaceArea(waterUnitaryCubes);
    const waterCubeOutsideArea = 2 * (xMax - xMin) * (yMax - yMin) + 2 * (xMax - xMin) * (zMax - zMin) + 2 * (yMax - yMin) * (zMax - zMin); // QUESTION: is it off by one error? even if yes it plays nice with isInRange
    return watterSurfaceArea - waterCubeOutsideArea;
}

if (process.argv[2]) {
    let input;
    try {
        input = fs.readFileSync(process.argv[2], "utf8");
    } catch (e) {
        console.log("Please specify file that exists");
        process.exit();
    }
    console.log("Part1:");
    console.log(day18(input));
    console.log("Part2:");
    console.log(day18Part2(input));
}
