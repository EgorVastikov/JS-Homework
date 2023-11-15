let count = 5;
arr = [];

for (let i = 1; i < count + 1; ++i) {
    arr.push(i);
}

for (let i = arr.length - 1; i > 0; --i) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

console.log(arr);

let n = 3;
let index = -1;

for (let i = 0; i < count; ++i) {
    if (arr[i] === n) {
        index = i;
        break;
    }
}
console.log(index === -1 ? "Элемент не найден" : index)