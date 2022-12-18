#!/usr/bin/env node
import fs from "fs";
import graphlib from "@dagrejs/graphlib";

function parseMap(input) {
    return input.split("\n").map(line => line.split("").map(c => c.charCodeAt(0)));
}

function nodeName(h, w) {
    return `${h},${w}`;
}

function buildGraph(grid) {
    const graph = new graphlib.Graph();

    function registerConnection(startNode, startElevation, h, w) {
        if (grid[h]) {
            const adjacentNode = nodeName(h, w);
            if (grid[h][w] <= startElevation + 1) {
                graph.setEdge(startNode, adjacentNode);
            }
        }
    }

    for (let h = 0; h < grid.length; h++) {
        for (let w = 0; w < grid[h].length; w++) {
            const currentNode = nodeName(h, w);
            graph.setNode(currentNode);
            const currentNodeElevation = grid[h][w];
            registerConnection(currentNode, currentNodeElevation, h, w - 1);
            registerConnection(currentNode, currentNodeElevation, h - 1, w);
            registerConnection(currentNode, currentNodeElevation, h, w + 1);
            registerConnection(currentNode, currentNodeElevation, h + 1, w);
        }
    }
    return graph;
}

function findFirstInGrid(grid, toBeFound) {
    for (let h = 0; h < grid.length; h++) {
        for (let w = 0; w < grid[h].length; w++) {
            if (grid[h][w] === toBeFound) {
                return {w, h, name: nodeName(h, w)};
            }
        }
    }
    return undefined;
}

function findAllInGrid(grid, toBeFound) {
    const result = []
    for (let h = 0; h < grid.length; h++) {
        for (let w = 0; w < grid[h].length; w++) {
            if (grid[h][w] === toBeFound) {
                result.push({w, h, name: nodeName(h, w)});
            }
        }
    }
    return result;
}

function day12(input) {
    const grid = parseMap(input);

    const start = findFirstInGrid(grid, "S".charCodeAt(0));
    grid[start.h][start.w] = "a".charCodeAt(0);
    const end = findFirstInGrid(grid, "E".charCodeAt(0));
    grid[end.h][end.w] = "z".charCodeAt(0);

    const graph = buildGraph(grid);
    // it could be the case graph is not connected, then it needs to be pruned, remove nodes not connected to starting node, find connected part of graph
    // leave only vertices that are connected to
    // const minimumSpanningTree = graphlib.alg.prim(graph, () => 1);
    const shortestPath = graphlib.alg.dijkstra(graph, start.name);
    return shortestPath[end.name].distance;
}

function day12Part2(input) {
    const grid = parseMap(input);

    const start = findFirstInGrid(grid, "S".charCodeAt(0));
    grid[start.h][start.w] = "a".charCodeAt(0);
    const end = findFirstInGrid(grid, "E".charCodeAt(0));
    grid[end.h][end.w] = "z".charCodeAt(0);

    const allAs = findAllInGrid(grid, "a".charCodeAt(0))

    const graph = buildGraph(grid);

    return Math.min(
        ...allAs.map(a => {
            const shortestPath = graphlib.alg.dijkstra(graph, a.name);
            return shortestPath[end.name].distance
        })
    );
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
