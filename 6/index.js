#!/usr/bin/env node


function findFirstChars(windowSize, dataStream) {
    if (dataStream.length < windowSize) return undefined;

    for (let i = windowSize; i < dataStream.length; i++) {
        const currentWindow = dataStream.slice(i - windowSize, i).split("");
        if ((new Set(currentWindow)).size === windowSize) return i;
    }
    return undefined;
}

function day6(input) {
    return input.split("\n")
        .map(dataStream => {
            return findFirstChars(4, dataStream);
        })
}

function day6Part2(input) {
    return input.split("\n")
        .map(dataStream => {
            return findFirstChars(14, dataStream);
        })
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day6(input));
    console.log("Part2:");
    console.log(day6Part2(input));
}