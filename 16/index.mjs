#!/usr/bin/env node
import fs from "fs";

function parseInput(input) {
    input
}

function day16(input) {
    const [valvesPresure, graph] = parseInput(input);
    return undefined;
}
function day16Part2(input) {
    return undefined;
}

let input;
try {
    input = fs.readFileSync(process.argv[2], "utf8");
} catch (e) {
    console.log("Please specify file that exists");
    process.exit();
}
console.log("Part1:");
console.log(day16(input));
console.log("Part2:");
console.log(day16Part2(input));
