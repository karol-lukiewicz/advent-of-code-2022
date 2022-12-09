#!/usr/bin/env node

function parseTreesHeights(input) {
    return input.split("\n").map(line => line.split("").map(tree => Number(tree)))
}

function isTreeVisibleFromLeft(treesRow, inspectedColumn) {
    const inspectedTree = treesRow[inspectedColumn];
    for (let column = 0; column < inspectedColumn; column++) {
        if (treesRow[column] >= inspectedTree) return false;
    }
    return true;
}

function isTreeVisibleFromRight(treesRow, inspectedColumn) {
    const inspectedTree = treesRow[inspectedColumn];
    for (let column = inspectedColumn + 1; column < treesRow.length; column++) {
        if (treesRow[column] >= inspectedTree) return false;
    }
    return true;
}

function isTreeVisibleFromUp(trees, inspectedRow, inspectedColumn) {
    const inspectedTree = trees[inspectedRow][inspectedColumn];
    for (let row = 0; row < inspectedRow; row++) {
        if (trees[row][inspectedColumn] >= inspectedTree) return false;
    }
    return true;
}

function isTreeVisibleFromDown(trees, inspectedRow, inspectedColumn) {
    const inspectedTree = trees[inspectedRow][inspectedColumn];
    for (let row = inspectedRow + 1; row < trees.length; row++) {
        if (trees[row][inspectedColumn] >= inspectedTree) return false;
    }
    return true;
}

function day8(input) {
    const trees = parseTreesHeights(input);
    let visibleTrees = trees.length * 2 + trees[0].length * 2 - 4;
    for (let row = 1; row < trees.length - 1; row++) {
        const treesRow = trees[row];
        for (let column = 1; column < treesRow.length - 1; column++) {
            if (isTreeVisibleFromLeft(treesRow, column)) {
                // console.log(`(${row},${column}) LEFT`);
                visibleTrees += 1;
            } else if (isTreeVisibleFromRight(treesRow, column)) {
                // console.log(`(${row},${column}) RIGHT`);
                visibleTrees += 1;
            } else if (isTreeVisibleFromUp(trees, row, column)) {
                // console.log(`(${row},${column}) UP`);
                visibleTrees += 1;
            } else if (isTreeVisibleFromDown(trees, row, column)) {
                // console.log(`(${row},${column}) DOWN`);
                visibleTrees += 1;
            }
        }
    }
    return visibleTrees;
}

function upScore(trees, inspectedRow, inspectedColumn) {
    const inspectedTree = trees[inspectedRow][inspectedColumn];
    for (let row = inspectedRow - 1; row >= 0; row--) {
        if (trees[row][inspectedColumn] >= inspectedTree) return inspectedRow - row;
    }
    return inspectedRow;
}

function downScore(trees, inspectedRow, inspectedColumn) {
    const inspectedTree = trees[inspectedRow][inspectedColumn];
    for (let row = inspectedRow + 1; row < trees.length; row++) {
        if (trees[row][inspectedColumn] >= inspectedTree) return row - inspectedRow;
    }
    return trees.length - 1 - inspectedRow;
}

function leftScore(trees, inspectedRow, inspectedColumn) {
    const inspectedTree = trees[inspectedRow][inspectedColumn];
    for (let column = inspectedColumn - 1; column >= 0; column--) {
        if (trees[inspectedRow][column] >= inspectedTree) return inspectedColumn - column;
    }
    return inspectedColumn;
}

function rightScore(trees, inspectedRow, inspectedColumn) {
    const inspectedTree = trees[inspectedRow][inspectedColumn];
    for (let column = inspectedColumn + 1; column < trees[inspectedRow].length; column++) {
        if (trees[inspectedRow][column] >= inspectedTree) return column - inspectedColumn;
    }
    return trees[inspectedRow].length - 1 - inspectedColumn;
}

function getScore(trees, row, column) {
    const up = upScore(trees, row, column);
    const down = downScore(trees, row, column);
    const left = leftScore(trees, row, column);
    const right = rightScore(trees, row, column);
    // console.log(`(${row},${column})=${trees[row][column]} U:${up} D:${down} L:${left} R:${right}`);
    return (
        up *
        down *
        left *
        right
    );
}

function day8Part2(input) {
    const trees = parseTreesHeights(input);
    console.log(trees);
    let highestScore = 0
    for (let row = 0; row < trees.length; row++) {
        const treesRow = trees[row];
        for (let column = 0; column < treesRow.length; column++) {
            const score = getScore(trees, row, column);
            highestScore = Math.max(highestScore, score);
        }
        // console.log()
    }
    return highestScore;
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day8(input));
    console.log("Part2:");
    console.log(day8Part2(input));
}