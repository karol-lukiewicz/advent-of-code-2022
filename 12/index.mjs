#!/usr/bin/env node
import fs from "fs";

function day12(input) {
    console.log("INPUT:");
    console.log(input);
    const grid = input.split("\n").map(line => line.split("").map(c => c.charCodeAt(0)));

    const graph = {};
    for (let h = 0; h < grid.length; h++) {
        for (let w = 0; w < grid[h].length; w++) {
            const nodeName = `${h},${w}`;
            const elevation = grid[h][w];
            if (elevation === "S".charCodeAt(0)) {
                console.log(`Start: [${h},${w}]`);
            }
            if (elevation === "E".charCodeAt(0)) {
                console.log(`End: [${h},${w}]`);
            }
            const connectedNodes = {};
            if (grid[h] && (grid[h][w - 1] === elevation || grid[h][w - 1] === elevation+1)) connectedNodes[`${h},${w - 1}`] = 1;
            if (grid[h - 1] && (grid[h - 1][w] === elevation || grid[h - 1][w] === elevation+1)) connectedNodes[`${h - 1},${w}`] = 1;
            if (grid[h] && (grid[h][w + 1] === elevation || grid[h][w + 1] === elevation+1)) connectedNodes[`${h},${w + 1}`] = 1;
            if (grid[h + 1] && (grid[h + 1][w] === elevation || grid[h + 1][w] === elevation+1)) connectedNodes[`${h + 1},${w}`] = 1;
            graph[nodeName] = connectedNodes;
        }
    }
    console.log(graph);


    // TODO parse input
    // TODO build graph
    // TODO find shortest path
    //
    let graphExample = {
        start: {A: 5, B: 2},
        A: {start: 1, C: 4, D: 2},
        B: {A: 8, D: 7},
        C: {D: 6, finish: 3},
        D: {finish: 1},
        finish: {},
    };
    return input.length;
}

function day12Part2(input) {
    return input.length;
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
    console.log(day12(input));
    console.log("Part2:");
    console.log(day12Part2(input));
}