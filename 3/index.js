#!/usr/bin/env node

function sum(array) {
    return array.reduce((acc, val) => acc + val);
}


const a_CHAR_CODE = 'a'.charCodeAt(0)
const A_CHAR_CODE = 'A'.charCodeAt(0)

function findIntersection(array1, array2) {
    return Array.from(new Set(
        array1.filter(x => array2.includes(x))
    ));
}

function findMistake(rucksack) {
    const firstCompartment = rucksack.slice(0, rucksack.length / 2).split("");
    const secondCompartment = rucksack.slice(rucksack.length / 2, rucksack.length).split("");
    const intersection = findIntersection(firstCompartment, secondCompartment);
    return intersection[0];
}

function toPriority(mistake) {
    const charCode = mistake.charCodeAt(0);
    return charCode >= a_CHAR_CODE ? charCode - a_CHAR_CODE + 1 : charCode - A_CHAR_CODE + 27;
}

function calculatePriority(rucksack) {
    const mistake = findMistake(rucksack);
    return toPriority(mistake);
}

function day3(input) {
    return sum(input
        .split("\n")
        .map(calculatePriority)
    );
}

function day3Part2(input) {
    const rucksack = input.split("\n");
    const groups = Array.from(Array(rucksack.length / 3)).map(_ => rucksack.splice(0, 3));
    const priorities = groups.map(group => {
        return findIntersection(
            findIntersection(group[0].split(""), group[1].split("")),
            group[2].split(""))[0];
    }).map(badge => toPriority(badge));

    return sum(priorities);
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day3(input));
    console.log("Part2:");
    console.log(day3Part2(input));
}