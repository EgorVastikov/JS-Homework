let n = -3;
let m = -10;

let left = Math.min(n, m)
let right = Math.max(n, m)

let random1 = Math.floor(Math.random() * (right - left + 1)) + left;
let random2 = Math.floor(Math.random() * (right - left + 1)) + left;

console.log("Случайное число 1:", random1);
console.log("Случайное число 2:", random2);

console.log("Число 1 > числа 2:", random1 > random2);
console.log("Число 1 < числа 2:", random1 < random2);
console.log("Число 1 >= числа 2:", random1 >= random2);
console.log("Число 1 <= числа 2:", random1 <= random2);
console.log("Число 1 === числу 2:", random1 === random2);
console.log("Число 1 !== числу 2:", random1 != random2);