#!/usr/bin/env node
import fs from "fs";
import {arrayFill, transpose} from "../utils.mjs";

function parseRocks(rocksTxt) {
    return rocksTxt.split("\n\n").map(rockTxt =>
        rockTxt.split("\n").map(rockLine =>
            rockLine.split("").map(space => space === "." ? undefined : space)
        )
    );
}

const WIND_SYMBOLS_TO_MOVE = {
    "<": -1,
    ">": 1,
};

function parseWinds(windsTxt) {
    return windsTxt.split("").map(windSymbol => WIND_SYMBOLS_TO_MOVE[windSymbol]).filter(Boolean);
}


const CHAMBER_WIDTH = 7;

function printRockPositionInChamber(rock, title) {
    console.log(title)
    console.log(
        rock.map(rockLine =>
            "\t|" + [...rockLine, Array(CHAMBER_WIDTH)].slice(0, CHAMBER_WIDTH).map(s => s || ".").join("") + "|"
        ).join("\n")
    );
}

function printChamber(chamber, title, indent) {
    if (title) console.log(title)
    const height = chamberTopIndex(chamber) + 1;
    const allHeights = transpose([
        Array(height).fill(indent ? "\t|" : "|"),
        ...chamber,
        Array(height).fill("|")
    ])
        .map(line => line.map(s => s || ".").join(""))
        .reverse()
        .join("\n");
    console.log(
        (allHeights ? (allHeights + "\n") : "")
        + (indent ? "\t+" : "+") + Array(CHAMBER_WIDTH).fill("-").join("") + "+"
    );
}

function toRockFalling(rocks) {
    return rocks.map(rock =>
        rock.map(rockLine => (
            [...Array(2).fill(undefined), ...rockLine, ...Array(CHAMBER_WIDTH - 2).fill(undefined)]
                .slice(0, CHAMBER_WIDTH))
        ));
}

function canRockBeBlown(rock, windDirection, rockHeight, chamber, windNo) {
    if (windNo === 12) debugger;
    if (windDirection === -1) {
        if (!rock.some(l => l[0])) {
            const newRockPosition = moveLeftOrRight(rock, windDirection);
            return canRockBeAtHeight(newRockPosition, rockHeight, chamber);
        }
        return false;
    }
    if (windDirection === 1) {
        if (!rock.some(l => l[CHAMBER_WIDTH - 1])) {
            const newRockPosition = moveLeftOrRight(rock, windDirection);
            return canRockBeAtHeight(newRockPosition, rockHeight, chamber);
        }
        return false;
    }
    throw new Error(`Unsupported horizontal move: ${windDirection}`)
}

function moveLeftOrRight(rock, windDirection) {
    return rock.map(rockLine => ( // assumption that rock lines are CHAMBER_WIDTH
        [...rockLine.slice(-windDirection), ...rockLine.slice(0, -windDirection)]
    ));
}

function canRockBeAtHeight(rock, heightToCheck, chamber) {
    const rockReverse = [...rock].reverse();
    for (let i = 0; i < rockReverse.length; i++) {
        const height = heightToCheck + i;
        const rockLine = rockReverse[i];
        for (let column = 0; column < CHAMBER_WIDTH; column++) {
            if (rockLine[column] && chamber[column][height]) {
                return false;
            }
        }
    }
    return true;
}

function putRockAtHeightInChamber(rock, rockHeight, chamber) {
    const rockReverse = [...rock].reverse();
    for (let i = 0; i < rockReverse.length; i++) {
        const height = rockHeight + i;
        const rockLine = rockReverse[i];
        for (let column = 0; column < CHAMBER_WIDTH; column++) {
            if (rockLine[column]) {
                chamber[column][height] = rockLine[column];
            }
            if (!chamber[column][height]) chamber[column][height] = undefined; // deals with js sparse arrays!
        }
    }
    return chamber;
}


function chamberTopIndex(chamber) {
    return Math.max(...chamber.map(column => column.findLastIndex(space => space)));
}

function simulateFallingRocks(rocks, winds, rocksToSimulate) {
    const rockFalling = toRockFalling(rocks);
    let chamber = arrayFill(CHAMBER_WIDTH, () => []);
    let windNo = 0;
    for (let rockNo = 0; rockNo < rocksToSimulate; rockNo++) {
        let rock = rockFalling[rockNo % rockFalling.length];
        let rockBottomInChamberIndex = chamberTopIndex(chamber) + 4;
        // printRockPositionInChamber(rock, `starting with rock`);
        let rockCanFallDown = true;
        while (rockCanFallDown) {
            // wind
            const windDirection = winds[windNo % winds.length];
            if (canRockBeBlown(rock, windDirection, rockBottomInChamberIndex, chamber, windNo)) {
                // printRockPositionInChamber(rock, `${windNo} wind new rock position: ${windDirection > 0 ? "->" : "<-"}`);
                rock = moveLeftOrRight(rock, windDirection);
            }
            windNo += 1;

            // falling
            if (rockBottomInChamberIndex > 0 && canRockBeAtHeight(rock, rockBottomInChamberIndex - 1, chamber)) {
                rockBottomInChamberIndex -= 1
            } else {
                rockCanFallDown = false;
                chamber = putRockAtHeightInChamber(rock, rockBottomInChamberIndex, chamber);
                // printChamber(chamber, "success")
            }
        }
    }
    return chamber;
}

function day17(rocksTxt, windsTxt) {
    const rocks = parseRocks(rocksTxt);
    const winds = parseWinds(windsTxt);

    let chamber = simulateFallingRocks(rocks, winds, 2022);
    // printChamber(chamber);
    return chamberTopIndex(chamber) + 1;
}


let rocks, winds;
try {
    rocks = fs.readFileSync(process.argv[2], "utf8");
    winds = fs.readFileSync(process.argv[3], "utf8");
} catch (e) {
    console.log("Please specify file that exists");
    process.exit();
}
console.log("Part1:");
console.log(day17(rocks, winds));
// console.log("Part2:");
// console.log(day17Part2(rocks, winds));
