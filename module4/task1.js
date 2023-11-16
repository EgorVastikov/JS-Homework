let n = -3;
let m = -10;
let count = 43;
let arr = [];

for (let i = 0; i < count; ++i) {
    let number = Math.floor(Math.random() * (m - n + 1)) + n;
    arr.push(number)
}

console.log(arr);