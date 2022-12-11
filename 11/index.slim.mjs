#!/usr/bin/env node
import fs from "fs";

async function parseInput(input) {
    let monkeysCode = input
        .split("\n\n")
        .map(monkeyDesc => {
            const fields = monkeyDesc
                .split("\n").slice(1) // removes first line
                .map(line => line.trim())
                .join("\n")
                .replace(/^Starting items: ([\d, ]+)/, "\titems: [$1],")
                .replace(/Operation: new = (.+)/, "\toperation: old => ($1),")
                .replace(
                    /Test: divisible by (\d+)\nIf true: throw to monkey (\d+)\nIf false: throw to monkey (\d+)/,
                    "\ttest: (lvl) => ((lvl % $1 === 0) ? $2 : $3)," + "\n\tdivisor: $1,"
                )
                // .replaceAll(/(\d+)/g, "$1n")
            ;
            return "{\n\toperationsCount: 0,\n" + fields + "\n}";
        })
        .join(",\n");
    monkeysCode = "const monkeys = [\n" + monkeysCode + "\n];\n" + "export {monkeys};";
    const filename = `monkeysCode.${(Math.random() + 1).toString(36).substring(7)}.mjs`;
    fs.writeFileSync(filename, monkeysCode);
    const {monkeys} = await import((`./${filename}`));
    fs.rmSync(filename);
    if (!monkeys) throw new Error("failed to load generated modules.");
    return monkeys;
}

const turn = (monkeys, monkeyNo, worryLvl, worryLvlDivider, commonDivisor) => {
    const monkey = monkeys[monkeyNo];
    monkey.operationsCount = monkey.operationsCount + 1;
    let newWorryLvl = monkey.operation(worryLvl);
    if (worryLvlDivider) {
        newWorryLvl = (newWorryLvl - (newWorryLvl % worryLvlDivider)) / worryLvlDivider;
    }
    const newMonkeyNo = Number(monkey.test(newWorryLvl));
    monkeys[newMonkeyNo].items.push(newWorryLvl % commonDivisor);
};


async function takeTurns(monkeys, turns, worryLvlDivider = 0/*, log = () => undefined, table = () => undefined*/) {
    const commonDivisor = monkeys.map(m => m.divisor).reduce((acc, val) => (acc * val), 1);
    for (let roundNo = 0; roundNo < turns; roundNo++) {
        for (let monkeyNo = 0; monkeyNo < monkeys.length; monkeyNo++) {
            const worryLvls = monkeys[monkeyNo].items;
            for (let i = 0; i < worryLvls.length; i++) {
                turn(monkeys, monkeyNo, worryLvls[i], worryLvlDivider, commonDivisor);
            }
            worryLvls.length = 0;
        }
    }
}


async function day11(input) {
    const monkeys = await parseInput(input);
    await takeTurns(monkeys, 20, 3/*, console.log, console.table*/);
    const [mostActiveMonkey, secondMostActiveMonkey] = monkeys.map(m => m.operationsCount).sort((a, b) => b - a).slice(0, 2);
    const monkeyBusiness = mostActiveMonkey * secondMostActiveMonkey;
    return monkeyBusiness;
}

async function day11Part2(input) {
    const monkeys = await parseInput(input);
    await takeTurns(monkeys, 10_000);
    const monkeyActivity = monkeys.map(m => m.operationsCount);
    const [mostActiveMonkey, secondMostActiveMonkey] = Object.values(monkeyActivity).sort((a, b) => b - a).slice(0, 2);
    const monkeyBusiness = mostActiveMonkey * secondMostActiveMonkey;
    return monkeyBusiness;
}


if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(await day11(input));
    console.log("Part2:");
    console.log(await day11Part2(input));
}