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

function day18(input) {
    const sidesByCube = parseScan(input)
        .flatMap(cube => listSides(cube))
        .map(([start, end]) => ([...start, ...end].join(",")))
        .group(item => item);
    return Object.entries(sidesByCube)
        .filter(([_key, values]) => (values.length === 1))
        .length
}


function day18Part2(input) {

}

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
