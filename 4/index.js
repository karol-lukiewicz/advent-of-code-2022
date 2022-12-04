#!/usr/bin/env node

function isFullyContained(bigger, smaller) {
    return bigger[0] <= smaller[0] && smaller[1] <= bigger[1];
}

function isAnyFullyContained(first, second, index) {
    return isFullyContained(first, second, index)
        || isFullyContained(second, first, index);
}

function parsePairsRanges(input) {
    return input
        .split("\n")
        .map(pairRaw => pairRaw.split(",").map(rangeRaw => rangeRaw.split("-").map(Number)))
        .map(pair => pair.map(range => range.sort((a, b) => a - b)));
}

function day4(input) {
    return parsePairsRanges(input)
        .filter(([first, second], index) => isAnyFullyContained(first, second, index))
        .length;
}

function calculateOverlap(first, second) {
    if (first[0] > second[1] || first[1] < second[0]) {
        // first range beginning is bigger than whole second
        // or
        // first range ending is smaller than whole second
        return 0;
    }
    return Math.min(first[1], second[1]) - Math.max(first[0], second[0]) + 1;
}

function day4Part2(input) {
    return parsePairsRanges(input)
        .map(([first, second]) => calculateOverlap(first, second))
        .filter(overlap => overlap > 0)
        .length;
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day4(input));
    console.log("Part2:");
    console.log(day4Part2(input));
}