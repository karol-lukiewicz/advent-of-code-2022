#!/usr/bin/env node

function sumCaloriesByElf(input) {
    return input
        .split("\n\n")
        .map(elfCalories => elfCalories
            .split("\n")
            .map(Number)
            .reduce((acc, val) => acc + val, 0));
}

function day1CalorieCounting(input) {
    const calories = sumCaloriesByElf(input);
    return Math.max(...calories);
}

function day1CalorieCountingPart2(input) {
    const calories = sumCaloriesByElf(input);
    return calories
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((acc, val) => acc + val, 0);
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day1CalorieCounting(input));
    console.log("Part2:");
    console.log(day1CalorieCountingPart2(input));
}