function createStudentsList(listArr) {
    let ul = document.createElement('ul');

    for (let student of listArr) {
        let li = document.createElement('li');
        let h2 = document.createElement('h2');
        let span = document.createElement('span');

        h2.textContent = student.name;
        span.textContent = `Возраст: ${student.age} лет`;

        li.appendChild(h2);
        li.appendChild(span);
        ul.appendChild(li); 
    }

    document.body.appendChild(ul);
}

let allStudents = [
    {name: 'Валя', age: 11},
    {name: 'Таня', age: 24},
    {name: 'Рома', age: 21},
    {name: 'Надя', age: 34},
    {name: 'Антон', age: 7}
];

let showListButton = document.querySelector('.show-list');

showListButton.addEventListener('click', function() {
    createStudentsList(allStudents);
});
