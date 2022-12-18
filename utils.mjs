export function sum(array) {
    return array.reduce((acc, val) => acc + val);
}

export function numbersAsc(a, b) {
    return a - b;
}

export function numbersDesc(a, b) {
    return b - a;
}

export function transpose(matrix) {
    const maxWidth = Math.max(...matrix.map(row => row.length))
    const trans = arrayFill(maxWidth, () => []);
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            trans[j][i] = matrix[i][j];
        }
    }
    return trans;
}


export function arrayFill(length, factory = () => undefined) {
    return Array(length).fill(undefined).map((_, i) => factory(i));
}

