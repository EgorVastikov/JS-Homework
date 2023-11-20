function createStudentCard(name, age) {
    var card = document.createElement('div');
    var nameElement = document.createElement('h2');

    nameElement.textContent = name;
    var ageElement = document.createElement('span');
    ageElement.textContent = `Возраст: ${age} лет`;

    card.appendChild(nameElement);
    card.appendChild(ageElement);
    document.body.appendChild(card);
}

createStudentCard('Игорь', 17);