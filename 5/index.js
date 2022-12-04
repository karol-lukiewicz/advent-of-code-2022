#!/usr/bin/env node

function sum(array) {
    return array.reduce((acc, val) => acc + val);
}

function parseInstructions(movesRaw) {
    return movesRaw
        .split("\n")
        .flatMap(move => {
            const found = move.match(/^move (\d+) from (\d+) to (\d+)$/);
            if (found) {
                return [{
                    "count": found[1],
                    "start": found[2],
                    "end": found[3]
                }];
            }
            return [];
        })
}

function parseStack(stacksRaw,) {
    const heights = stacksRaw
        .split("\n")
        .reverse()
        .splice(1) // removes 1 2 3
        .filter(line => Boolean(line))
        .map(line =>
            line.match(/.{1,4}/g).map(cell => {
                const match = cell.match(/(\w)/g);
                return match ? match[0] : undefined;
            }))
    const numberOfStacks = heights.reduce((acc, val) => Math.max(val.length, acc), 0)
    return Array.from(Array(numberOfStacks).keys())
        .map(stackNumber => heights.map(height => height[stackNumber]))
        .map(stack => stack.filter(cell => cell !== undefined));
}

function moveStack(currentStack, move, moveOneAtaTime) {
    const startIndex = move.start-1;
    const endIndex = move.end-1;
    const nextStacks = [...currentStack]
    const newStartStack = [...nextStacks[startIndex]];
    const blocksToMove = newStartStack
        .splice(newStartStack.length-move.count, move.count)  // NOTE newStartStack mutation
    ;
    const newEndStack = [ ...nextStacks[endIndex], ...(moveOneAtaTime ? blocksToMove.reverse() : blocksToMove)] // NOTE potential blocksToMove mutation
    nextStacks[startIndex] = newStartStack
    nextStacks[endIndex] = newEndStack
    return nextStacks;
}

function day5(input) {
    const [stacksRaw, movesRaw] = input.split("\n\n");

    const moves = parseInstructions(movesRaw);
    const initialStacks = parseStack(stacksRaw);

    const finalStacks = moves.reduce((currentStack, move) => moveStack(currentStack, move, true), initialStacks)

    return finalStacks.map(stack => stack.filter(a => a).at(-1)).join("");
}

function day5Part2(input) {
    const [stacksRaw, movesRaw] = input.split("\n\n");

    const moves = parseInstructions(movesRaw);
    const initialStacks = parseStack(stacksRaw);

    const finalStacks = moves.reduce((currentStack, move) => moveStack(currentStack, move, false), initialStacks)

    return finalStacks.map(stack => stack.filter(a => a).at(-1)).join("");
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day5(input));
    console.log("Part2:");
    console.log(day5Part2(input));
}