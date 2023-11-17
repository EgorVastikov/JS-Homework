function getAge(year) {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    return currentYear - year;
}

console.log(getAge(1998))