#!/usr/bin/env node

class Noop {
    execute(registry) {
        return [registry, [registry]];
    }
}

class AddX {
    #value

    constructor(value) {
        this.#value = value;
    }

    execute(registry) {
        return [registry + this.#value, [registry, registry]];
    }
}

function parseInstructions(input) {
    return input.split("\n").filter(Boolean).map(line => {
        const [command, value] = line.split(" ");
        if (command === "noop") return new Noop();
        if (command === "addx") return new AddX(parseInt(value));
        throw new Error(`Unknown command: "${line}"`)
    });
}

function executeInstructions(instructions) {
    let registryX = 1;
    const registryXHistory = [];
    for (const instruction of instructions) {
        const [afterLastCycleValue, intermediateCyclesValues] = instruction.execute(registryX);
        registryXHistory.push(...intermediateCyclesValues);
        registryX = afterLastCycleValue;
    }
    return registryXHistory;
}

function sum(array) {
    return array.reduce((acc, val) => acc + val);
}

function day10(input) {
    const instructions = parseInstructions(input);
    const registryXHistory = executeInstructions(instructions);

    const signalStrengthCycles = [20, 60, 100, 140, 180, 220];

    const signalStrengths = signalStrengthCycles.map(cycleNo => (cycleNo * registryXHistory[cycleNo - 1]));

    return sum(signalStrengths);
}

function chunk([...list], chunkSize) {
    return [...Array(Math.ceil(list.length / chunkSize))].map(_ => list.splice(0, chunkSize));
}

function day10Part2(input) {
    const instructions = parseInstructions(input);
    const registryXHistory = executeInstructions(instructions);
    let crtScreen = []
    for (let cycle = 0; cycle < registryXHistory.length; cycle++) {
        const registryX = registryXHistory[cycle];
        const middlePixel = cycle % 40
        if (registryX - 1 <= middlePixel && middlePixel <= registryX + 1) {
            crtScreen.push("#");
        } else {
            crtScreen.push(".");
        }
    }
    return chunk(crtScreen, 40).map(line => line.join("")).join("\n");
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day10(input));
    console.log("Part2:");
    console.log(day10Part2(input));
}