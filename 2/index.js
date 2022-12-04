#!/usr/bin/env node


const OPPONENT_MOVE = {
    "A": "Rock",
    "B": "Paper",
    "C": "Scissors"
};
const MY_MOVE_PART1 = {
    "X": "Rock",
    "Y": "Paper",
    "Z": "Scissors"
};

const MY_MOVE_POINT = {
    "Rock": 1,
    "Paper": 2,
    "Scissors": 3,
};

function shapeOutcome(myMove) {
    return MY_MOVE_POINT[myMove] || 0;
}

const POINTS = {
    "WIN": 6,
    "DRAW": 3,
    "LOST": 0,
};

const SCORES_PART1 = {
    "Rock": {
        "Rock": POINTS.DRAW,
        "Paper": POINTS.LOST,
        "Scissors": POINTS.WIN,
    },
    "Paper": {
        "Rock": POINTS.WIN,
        "Paper": POINTS.DRAW,
        "Scissors": POINTS.LOST,
    },
    "Scissors": {
        "Rock": POINTS.LOST,
        "Paper": POINTS.WIN,
        "Scissors": POINTS.DRAW,
    }
};

function scoreOutcome(myMove, opponentMove) {
    return SCORES_PART1[myMove][opponentMove];
}

function sum(array) {
    return array.reduce((acc, val) => acc + val);
}

function day2RockPaperScissors(input) {
    const results = input.split("\n").map(moves => {
        const [opponentMoveSymbol, myMoveSymbol] = moves.split(" ");
        const opponentMove = OPPONENT_MOVE[opponentMoveSymbol];
        const myMove = MY_MOVE_PART1[myMoveSymbol];
        return shapeOutcome(myMove) + scoreOutcome(myMove, opponentMove);
    })
    return sum(results);
}


const SCORES_PART2 = {
    "X": POINTS.LOST,
    "Y": POINTS.DRAW,
    "Z": POINTS.WIN,
};

const MY_MOVES_PART2 = {
    [POINTS.WIN]: {
        "Rock": "Paper",
        "Paper": "Scissors",
        "Scissors": "Rock",
    },
    [POINTS.DRAW]: {
        "Rock": "Rock",
        "Paper": "Paper",
        "Scissors": "Scissors",
    },
    [POINTS.LOST]: {
        "Paper": "Rock",
        "Scissors": "Paper",
        "Rock": "Scissors",
    }
};

function myMove(routeEnd, opponentMove) {
    return MY_MOVES_PART2[routeEnd][opponentMove];
}

function day2RockPaperScissorsPart2(input) {
    const results = input.split("\n").map(moves => {
        const [opponentMoveSymbol, routeEndSymbol] = moves.split(" ");
        const routeEnd = SCORES_PART2[routeEndSymbol];
        const opponentMove = OPPONENT_MOVE[opponentMoveSymbol];
        return shapeOutcome(myMove(routeEnd, opponentMove)) + routeEnd;
    })
    return sum(results);
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day2RockPaperScissors(input));
    console.log("Part2:");
    console.log(day2RockPaperScissorsPart2(input));
}