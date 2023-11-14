let userName = "EGOr";
let userSurname = "eGorOv";

let newUserName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
let newUserSurname = userSurname.charAt(0).toUpperCase() + userSurname.slice(1).toLowerCase();

console.log(newUserName);
console.log(newUserSurname);
console.log(userName === newUserName ? "Имя осталось без изменений" : "Имя было преобразовано");
console.log(userSurname === newUserSurname ? "Фамилия осталась без изменений" : "Фамилия была преобразована");