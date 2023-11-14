let a = 13.123456789;
let b = 2.123;
let n = 5;

let fractionalA = Math.floor((a % 1) * Math.pow(10, n));
let fractionalB = Math.floor((b % 1) * Math.pow(10, n));

console.log("Дробная часть A:", fractionalA);
console.log("Дробная часть B:", fractionalB);

console.log("a > b:", fractionalA > fractionalB);
console.log("a < b:", fractionalA < fractionalB);
console.log("a >= b:", fractionalA >= fractionalB);
console.log("a <= b:", fractionalA <= fractionalB);
console.log("a === b:", fractionalA === fractionalB);
console.log("a !== b:", fractionalA != fractionalB);
