#!/usr/bin/env node

function parseCommand(command) {
    const cdCommand = command.match(/^cd (.+)\n$/);
    if (cdCommand) {
        return {type: "cd", name: cdCommand[1]};
    }
    const lsCommand = command.match(/^ls\n([\s\S]+)$/);
    if (lsCommand) {
        const outputRaw = lsCommand[1];
        const output = outputRaw.split("\n").filter(Boolean).map(line => {
            const [first, name] = line.split(" ");
            if (first === "dir") {
                return {type: "dir", name}
            } else {
                return {type: "file", name, size: parseInt(first)}
            }
        })
        return {type: "ls", output};
    }
    throw new Error(`Unknown command: "${command}"`)
}


function parseLogs(input) {
    const commandsWithOutputRaw = input.split("$ ").filter(Boolean);
    return commandsWithOutputRaw.map(parseCommand);
}

function path(currentDirectory) {
    if (currentDirectory.name === "/") {
        return currentDirectory.name;
    }
    return path(currentDirectory.parent) + currentDirectory.name + "/";

}

function printFile(file) {
    console.log(`\t${file.name}\t(${file.size})`);
}

function printDir(directory) {
    console.log(`${path(directory)}\t${directory.size}`);
    directory.children.filter(n => n.type === "file").forEach(printFile);
    directory.children.filter(n => n.type === "dir").forEach(printDir);
}

function buildDirectoriesTree(commandsWithOutput) {
    const rootNode = {type: "dir", name: "/", children: []}
    rootNode.parent = rootNode;

    let currentDirectory = rootNode;
    for (const commandWithOutput of commandsWithOutput) {
        if (commandWithOutput.type === "cd") {
            if (commandWithOutput.name === "/") {
                currentDirectory = rootNode;
            } else if (commandWithOutput.name === "..") {
                currentDirectory = currentDirectory.parent;
            } else {
                const subDirectory = currentDirectory.children.find(node => node.type === "dir" && node.name === commandWithOutput.name);
                if (subDirectory === undefined) {
                    throw new Error(`cannot find subdirectory with name ${commandWithOutput.name} of directory ${path(currentDirectory)}`)
                }
                currentDirectory = subDirectory;
            }
        }
        if (commandWithOutput.type === "ls") {
            currentDirectory.children = commandWithOutput.output.map(entry => {
                if (entry.type === "dir") {
                    return {...entry, parent: currentDirectory, children: []}
                }
                if (entry.type === "file") {
                    return entry;
                }
                throw new Error(`unknown ls output entry ${entry} of directory ${path(currentDirectory)}`)
            });
        }
    }
    return rootNode;
}

function sum(array) {
    return array.reduce((acc, val) => acc + val, 0);
}

function calculateDirectoriesSizes(directory) {
    directory.children.filter(n => n.type === "dir").forEach(calculateDirectoriesSizes);
    directory.size = sum(directory.children.map(f => f.size));
    return directory;
}

function findSubDirectories(directory, predicate) {
    return [...(predicate(directory) ? [directory] : []), ...directory.children
        .filter(n => n.type === "dir")
        .flatMap(d => findSubDirectories(d, predicate))]
}


function day7(input) {
    const commandsWithOutput = parseLogs(input);
    const rootDirectory = buildDirectoriesTree(commandsWithOutput);
    calculateDirectoriesSizes(rootDirectory);
    // printDir(rootDirectory)

    const MAXIMAL_SIZE = 100_000;

    return sum(findSubDirectories(rootDirectory, d => (d.size <= MAXIMAL_SIZE))
        .map(dir => dir.size));
}

function day7Part2(input) {
    const commandsWithOutput = parseLogs(input);
    const rootDirectory = buildDirectoriesTree(commandsWithOutput);
    calculateDirectoriesSizes(rootDirectory);
    // printDir(rootDirectory)

    const unusedSpace = 70_000_000 - rootDirectory.size
    const spaceToDelete = 30_000_000 - unusedSpace;

    return findSubDirectories(rootDirectory, d => (d.size >= spaceToDelete))
        .sort((a, b) => a.size - b.size)[0].size;
}

if (process.argv[2]) {
    const input = String(process.argv.slice(2));
    console.log("Part1:");
    console.log(day7(input));
    console.log("Part2:");
    console.log(day7Part2(input));
}