function createStudentCard(student) {
    var card = document.createElement('div');
    var nameElement = document.createElement('h2');
    var ageElement = document.createElement('span');

    nameElement.textContent = student.name;
    ageElement.textContent = `Возраст: ${student.age} лет`;

    card.appendChild(nameElement);
    card.appendChild(ageElement);
    document.body.appendChild(card);
}

let studentObj={
    name: 'Игорь',
    age: 17
   }
createStudentCard(studentObj)