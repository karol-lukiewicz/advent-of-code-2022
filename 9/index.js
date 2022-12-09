#!/usr/bin/env node

function parseMoves(input) {
    return input.split("\n")
        .filter(move => Boolean(move))
        .map(move => {
            const [direction, numberOfStepsStr] = move.split(" ");
            return [direction, parseInt(numberOfStepsStr)];
        });
}

class PositionJournal {
    #visitedPositions = [];

    add({x, y}) {
        this.#visitedPositions.push({x, y})
    }

    listPositions = () => [...this.#visitedPositions]

    countPositions = () => new Set(this.#visitedPositions.map(position => `${position.x}|${position.y}`)).size;
}


function moveOneInDirection({x, y}, direction) {
    switch (direction) {
        case "D":
            return {x, y: y - 1};
        case "U":
            return {x, y: y + 1};
        case "L":
            return {x: x - 1, y};
        case "R":
            return {x: x + 1, y};
        default:
            throw new Error(`unknown direction ${direction}`);
    }
}

function moveAlong(leader, knot) {
    const vector = {x: leader.x - knot.x, y: leader.y - knot.y};
    if (Math.abs(vector.x) >= 2 || Math.abs(vector.y) >= 2) {
        return {
            x: knot.x + Math.sign(vector.x),
            y: knot.y + Math.sign(vector.y)
        }
    } else {
        return {...knot};
    }
}

function simulateRope([...knots], moves) {
    const journal = new PositionJournal();
    journal.add(knots.at(-1));
    for (const [direction, steps] of moves) {
        for (let step = 0; step < steps; step++) {
            knots[0] = moveOneInDirection(knots[0], direction)
            for (let knotNo = 1; knotNo < knots.length; knotNo++) {
                knots[knotNo] = moveAlong(knots[knotNo - 1], knots[knotNo]);
            }
            journal.add(knots.at(-1));
        }
    }

    // console.table(journal.listPositions());
    return journal.countPositions()
}

function day9(input) {
    const moves = parseMoves(input);
    let head = {x: 0, y: 0};
    let tail = {x: 0, y: 0};
    let knots = [head, tail];
    return simulateRope(knots, moves);
}

function day9Part2(input) {
    const moves = parseMoves(input);
    let knots = Array(10).fill({x: 0, y: 0});
    return simulateRope(knots, moves);
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day9(input));
    console.log("Part2:");
    console.log(day9Part2(input));
}