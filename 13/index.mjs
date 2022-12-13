#!/usr/bin/env node
import fs from "fs";

function day13(input) {
    const pairs = input
        .split("\n\n")
        .map(pairRaw =>
            pairRaw
                .split("\n")
                .map(packetDataRaw => JSON.parse(packetDataRaw))
        );
    let rightPairs = 0;
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (isInRightOrder(pair[0],pair[1])) {
            rightPairs += i+1;
        }
    }
    return rightPairs;
}

function isInRightOrder(left, right) {
    // console.log({left,right});
    if (typeof left === "number" && typeof right === "number") {
        if (left === right) {
            return undefined;
        } else {
            return left <= right;
        }
    }
    const leftArray = toArray(left);
    const rightArray = toArray(right);
    for (let i = 0; i < Math.max(leftArray.length, rightArray.length); i++) {
        const leftItem = leftArray[i];
        const rightItem = rightArray[i];
        if (typeof leftItem === "undefined") {
            return true;
        }
        if (typeof rightItem === "undefined") {
            return false;
        }
        const itemOrder = isInRightOrder(leftItem, rightItem);
        if (itemOrder !== undefined) {
            return itemOrder;
        }
    }
    return undefined;
}

function toArray(left) {
    return typeof left === 'number' ? [left] : left;
}

function day13Part2(input) {
    const packetData = input
        .replaceAll("\n\n", "\n")
        .split("\n")
        .map(packetDataRaw => JSON.parse(packetDataRaw))
    const dividerPacket1 = [[2]];
    const dividerPacket2 = [[6]];
    const sortedPackets = [...packetData, dividerPacket1, dividerPacket2].sort((a, b) => isInRightOrder(a,b)? -1: 1);
    return (sortedPackets.indexOf(dividerPacket1) + 1) * (sortedPackets.indexOf(dividerPacket2) + 1)
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
    console.log(day13(input));
    console.log("Part2:");
    console.log(day13Part2(input));
}