#!/usr/bin/env node

class Monkey {
    #name
    #items
    #operationStrs
    #worryLevelDivider
    #divisor
    #trueMonkey
    #falseMonkey
    #operationCount = 0;

    constructor(monkeyDesc, worryLevelDivider) {
        const lines = monkeyDesc.split("\n");
        this.#name = Monkey.parseName(lines);
        this.#items = Monkey.parseItems(lines);
        this.#operationStrs = Monkey.parseOperation(lines[2]);
        this.#worryLevelDivider = worryLevelDivider;
        ([
            this.#divisor,
            this.#trueMonkey,
            this.#falseMonkey
        ] = Monkey.parseTest(lines.slice(3)));
    }

    static parseName(lines) {
        return lines[0]
            .trim()
            .replace("Monkey ", "")
            .replace(":", "");
    }

    static parseItems(lines) {
        return lines[1]
            .replace("Starting items:", "")
            .replaceAll(" ", "")
            .split(",")
            .map(str => BigInt(str));
    }

    static parseOperation(operationDesc) {
        return operationDesc.replaceAll("Operation: new =", "")
            .replaceAll(" ", "")
            .split(/(\+|\*)/)
            .map(value => (["old", "+", "*"].includes(value)) ? value : BigInt(value));
    }

    static parseTest(testDesc) {
        const divisor = BigInt(testDesc[0].replaceAll("Test: divisible by", "").trim());
        const trueMonkey = testDesc[1].replaceAll("If true: throw to monkey", "").trim();
        const falseMonkey = testDesc[2].replaceAll("If false: throw to monkey", "").trim();
        return [divisor, trueMonkey, falseMonkey];
    }

    #operation(oldWorryLevel) {
        this.#operationCount = this.#operationCount + 1;
        const argLeft = this.#operationStrs[0] === "old" ? oldWorryLevel : this.#operationStrs[0];
        const argRight = this.#operationStrs[2] === "old" ? oldWorryLevel : this.#operationStrs[2];
        switch (this.#operationStrs[1]) {
            case "*":
                return (argLeft * argRight);
            case "+":
                return (argLeft + argRight);
        }
    }

    #test(worryLevel) {
        return worryLevel % this.#divisor
            ? this.#falseMonkey
            : this.#trueMonkey;
    }

    get name() {
        return this.#name;
    }

    get listItems() {
        return "Monkey " + this.#name + ": " + [...this.#items].join(", ");
    }

    get operationCount() {
        return this.#operationCount;
    }

    get divisor() {
        return this.#divisor;
    }

    takeTurn() {
        const throws = this.#items.map(itemWorryLevel => {
            let newWorryLevel;
            const operationResult = this.#operation(itemWorryLevel);
            if (this.#worryLevelDivider) {
                newWorryLevel = BigInt(Math.floor(Number(operationResult) / this.#worryLevelDivider));
            } else {
                newWorryLevel = operationResult;
            }
            // if (newWorryLevel > Number.MAX_SAFE_INTEGER) {console.log({newWorryLevel})}
            const throwToMonkey = this.#test(newWorryLevel);
            return [throwToMonkey, newWorryLevel];
        });
        this.#items = [];
        return throws;
    }

    catchItems(item) {
        this.#items.push(item);
    }

    toString() {
        return {
            name: this.#name,
            items: this.#items,
            operationStr: this.#operationStrs,
            divisor: this.#divisor,
            trueMonkey: this.#trueMonkey,
            falseMonkey: this.#falseMonkey,
            operationCount: this.#operationCount,
        }
    }
}

function parseInput(input, worryLevelDivider) {
    const monkeys = new Map(input
        .split("\n\n")
        .map(monkeyDesc => {
            const monkey = new Monkey(monkeyDesc, worryLevelDivider);
            return [monkey.name, monkey];
        }));
    return monkeys;
}

function takeTurns(monkeys, turns) {
    const commonDivisor = [...monkeys.values()].map(m => m.divisor).reduce((acc, val) => (acc * val), 1n);
    for (let roundNo = 0; roundNo < turns; roundNo++) {
        monkeys.forEach(m => {
            m.takeTurn().map(([monkeyName, itemWorryLevel]) => {
                monkeys.get(monkeyName).catchItems(itemWorryLevel % commonDivisor);
            })
        });
    }
}

function day11(input) {
    const monkeys = parseInput(input, 3);
    takeTurns(monkeys, 20);
    const [mostActiveMonkey, secondMostActiveMonkey] = [...monkeys.values()].map(monkey => monkey.operationCount).sort((a, b) => b - a).slice(0, 2);
    const monkeyBusiness = mostActiveMonkey * secondMostActiveMonkey;
    return monkeyBusiness;
}

function day11Part2(input) {
    const monkeys = parseInput(input);
    // takeTurns(monkeys, 10_000);
    takeTurns(monkeys, 10_000);
    const monkeyActivity = Object.fromEntries([...monkeys.values()].map(monkey => [monkey.name, monkey.operationCount]));
    console.log(Object.values(monkeyActivity));
    const [mostActiveMonkey, secondMostActiveMonkey] = Object.values(monkeyActivity).sort((a, b) => b - a).slice(0, 2);
    const monkeyBusiness = mostActiveMonkey * secondMostActiveMonkey;
    return monkeyBusiness;
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day11(input));
    console.log("Part2:");
    console.log(day11Part2(input));
}
