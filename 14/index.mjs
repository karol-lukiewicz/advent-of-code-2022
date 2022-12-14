#!/usr/bin/env node
import fs from "fs";

function parsePaths(input) {
    return input
        .split("\n")
        .map(textLine => textLine
            .split(" -> ")
            .map(pointRaw => {
                    const [x, y] = pointRaw
                        .split(",")
                        .map(n => Number(n));
                    return {x, y};
                }
            )
        );
}

function convertToScan(pathsPoints) {
    const scan = [];

    function drawPath(from, to) {
        for (let y = Math.min(from.y, to.y); y < Math.max(from.y, to.y) + 1; y++) {
            for (let x = Math.min(from.x, to.x); x < Math.max(from.x, to.x) + 1; x++) {
                if (scan[x] === undefined) scan[x] = [];
                scan[x][y] = "#";
            }
        }
    }

    for (let i = 0; i < pathsPoints.length; i++) {
        for (let j = 0; j < pathsPoints[i].length; j++) {
            const from = pathsPoints[i][j];
            const to = pathsPoints[i][j + 1];
            if (to === undefined) {
                if (j === 0) {
                    drawPath(from, from);
                }
            } else {
                drawPath(from, to);
            }
        }
    }
    return scan;
}

const DEBUG = Boolean(process.env.DEBUG)
const PRINT_OFFSET = Number(process.env.PRINT_OFFSET)

const print = !DEBUG
    ? () => undefined
    : (scan, xOffset = PRINT_OFFSET, yOffset = 0) => {
        const depths = [...scan.map(x => x.length)].map(v => v || 0);
        const deepestY = Math.max(...depths);
        let output = "";
        for (let x = xOffset; x < scan.length; x++) {
            output += String(x).padStart(4, '0');
            for (let y = yOffset; y < deepestY; y++) {
                output += (scan[x]?.[y] || ".");
            }
            output += "\n";
        }
        console.log(output);
    };

function simulateSandDrops(pathsPoints1) {
    const scan = convertToScan(pathsPoints1);
    // console.log(scan);
    print(scan);

    function drop(currentColumn, initialDepth) {
        const spaceBellow = (scan[currentColumn] ?? []).slice(initialDepth);
        const rockIndex = spaceBellow.findIndex(p => p === "#");
        const sandIndex = spaceBellow.findIndex(p => p === "o");
        const foundBottomDepth = initialDepth + Math.min(
            rockIndex === -1 ? Infinity : rockIndex,
            sandIndex === -1 ? Infinity : sandIndex
        );
        if (foundBottomDepth === Infinity || foundBottomDepth === 0) {
            return false
        }
        if (scan[currentColumn - 1]?.[foundBottomDepth] === undefined) {
            return drop(currentColumn - 1, foundBottomDepth);
        } else if (scan[currentColumn + 1]?.[foundBottomDepth] === undefined) {
            return drop(currentColumn + 1, foundBottomDepth);
        }
        scan[currentColumn][foundBottomDepth - 1] = "o";
        return true;
    }

    let unitsAfSand = 0;
    while (drop(500, 0)) {
        print(scan);
        unitsAfSand += 1;
    }
    print(scan);
    return unitsAfSand;
}

function day14(input) {
    const pathsPoints = parsePaths(input);
    return simulateSandDrops(pathsPoints);
}

function day14Part2(input) {
    const pathsPoints = parsePaths(input);
    const deepestScan = Math.max(...pathsPoints.flatMap(a => a).map(point => point.y));
    const farthestScan = Math.max(...pathsPoints.flatMap(a => a).map(point => point.x));
    const floor = [
        {x: 0, y: deepestScan + 2},
        {x: farthestScan + deepestScan + 2, y: deepestScan + 2}
    ];
    const pathsPointsWithFloor = [...pathsPoints, floor];
    return simulateSandDrops(pathsPointsWithFloor);
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
    console.log(day14(input));
    console.log("Part2:");
    console.log(day14Part2(input));
}