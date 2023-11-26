const studentsArray = [];

const maxDate = new Date().toISOString().split('T')[0];

function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const tableHeaders = document.querySelectorAll('.data-sort');
    const tableBody = document.getElementById('table-body');
    let sortOrder = 1;
    const columnMapping = {
        'ФИО': 'fullname',
        'Факультет': 'faculty',
        'Дата Рождения': 'dateOfBirth',
        'Годы Учебы': 'yearsStudy',
    };

    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const columnName = header.textContent.trim();
            const columnIndex = columnMapping[columnName];

            if (columnIndex) {
                handleSortClick(columnIndex, sortOrder);
                sortOrder = -sortOrder;
            }            
            handleSortClick('fullname', studentsArray);    
        });
    });

    function applyFilters() {
        const filteredStudents = studentsArray.filter(student => {
            const fullnameFilter = studentFilterForm.fullnameSearch.value.toLowerCase();
            const facultyFilter = studentFilterForm.facultySearch.value.toLowerCase();
            const yearBeginningStudyFilter = studentFilterForm.yearBeginningStudy.value;
            const yearGraduationFilter = studentFilterForm.yearGraduation.value;

            return (
                student.fullname.toLowerCase().includes(fullnameFilter) &&
                student.faculty.toLowerCase().includes(facultyFilter) &&
                (!yearBeginningStudyFilter || student.yearsStudy.getFullYear() == yearBeginningStudyFilter) &&
                (!yearGraduationFilter || (student.yearsStudy.getFullYear() + 4) == yearGraduationFilter)
            );
        });

        handleSortClick('fullname', filteredStudents);
    }

    
    function handleSortClick(columnIndex, students = studentsArray) {
        tableBody.innerHTML = '';

        students.sort((a, b) => {
            const valueA = a[columnIndex];
            const valueB = b[columnIndex];

            return valueA < valueB ? -sortOrder : valueA > valueB ? sortOrder : 0;
        });

        students.forEach((student) => {
            const row = document.createElement('tr');

            const name = document.createElement('td');
            name.textContent = student.fullname;

            const faculty = document.createElement('td');
            faculty.textContent = student.faculty;

            const dataBirth = document.createElement('td');
            dataBirth.textContent = formatDateString(student.dateOfBirth);

            const yearsStudy = document.createElement('td');
            yearsStudy.textContent = printYearsSchooling(student.yearsStudy);

            row.appendChild(name);
            row.appendChild(faculty);
            row.appendChild(dataBirth);
            row.appendChild(yearsStudy);

            tableBody.appendChild(row);
        });
    }        

    function formatDateString(date) {
        const dateObj = new Date(date);
        const age = new Date().getFullYear() - dateObj.getFullYear();
        return `${dateObj.toLocaleDateString()} (${age} лет)`;
    }
    
    function printYearsSchooling(date) {
        const startYear = new Date(date).getFullYear();
        const endYear = startYear + 4;
        const currentYear = new Date().getFullYear();
        const isFinished = currentYear > endYear || (currentYear === endYear && new Date().getMonth() > 8);
        return isFinished ? `${startYear}-${endYear} (закончил обучение)` : `${startYear}-${endYear} (${currentYear - startYear} курс)`;
    }

function createStudent(studentForm) {    

    const nameArray = studentForm.nameInput.value.trim().split(/\s+/);
    if (nameArray.length !== 3) {
        return;
    }    
    const faculty = studentForm.facultyInput.value.trim().split(/\s+/).join(' ');

    const { dataBirtInput, yearsStudyInput } = studentForm;
    const student = {
        name: nameArray[1],
        surname: nameArray[0],
        middleName: nameArray[2],
        fullname: nameArray.join(' '),
        faculty: faculty,
        dateOfBirth: new Date(dataBirtInput.value),
        yearsStudy: new Date(yearsStudyInput.value),
    };

    studentsArray.push(student);

    const row = document.createElement('tr');
    const studentData = [
        student.fullname,
        student.faculty,
        formatDateString(dataBirtInput.value),
        printYearsSchooling(yearsStudyInput.value)
    ];

    studentData.forEach(data => {
        const cell = document.createElement('td');
        cell.textContent = data;
        row.appendChild(cell);
    });

    return row;
}

function createStudentForm() {
    const form = createElement('form', 'input-group mb-3');
    const nameInput = createInput('ФИО', 'form-control');
    const facultyInput = createInput('Факультет', 'form-control');
    const dataBirtInput = createInput('Введите дату рождения', 'form-control', 'date', '1900-01-01', maxDate);
    const yearsStudyInput = createInput('Введите дату начала обучения', 'form-control', 'date', '2000-01-01', maxDate);
    const button = createElement('button', 'btn btn-primary', 'Добавить студента');
    const buttonWrapper = createElement('div', 'input-group-append d-block', null, button);

    form.append(nameInput, facultyInput, dataBirtInput, yearsStudyInput, buttonWrapper);

    return { form, nameInput, facultyInput, dataBirtInput, yearsStudyInput, button };
}

function createElement(tag, className, textContent = '', child = null) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    if (child) element.appendChild(child);
    return element;
}

function createInput(placeholder, className, type = 'text', min = '', max = '') {
    const input = createElement('input', className);
    input.placeholder = placeholder;
    if (type === 'date') {
        input.type = type;
        input.min = min;
        input.max = max;
    }
    return input;
}

    function handleInputChange() {
        studentForm.button.disabled = !(
            studentForm.nameInput.value &&
            studentForm.facultyInput.value &&
            studentForm.dataBirtInput.value &&
            studentForm.yearsStudyInput.value
        );
    }

function createFilterForm() {
    const form = createElement('form', 'input-group mb-3');
    const fullnameSearch = createInput('Введите часть имени для поиска', 'form-control');
    const facultySearch = createInput('Введите часть названия факультета для поиска', 'form-control');
    const yearBeginningStudy = createInput('Введите год начала обучения для поиска', 'form-control', 'number');
    const yearGraduation = createInput('Введите год окончания обучения для поиска', 'form-control', 'number');
    const clearButton = createElement('button', 'btn btn-primary', 'Очистить фильтры');

    form.append(fullnameSearch, facultySearch, yearBeginningStudy, yearGraduation, clearButton);

    return { form, fullnameSearch, facultySearch, yearBeginningStudy, yearGraduation, clearButton };
}

    applyFilters();

    const studentFilterForm = createFilterForm();
    const filterForm = document.getElementById('filter-form');
    const studentForm = createStudentForm();
    const inputForm = document.getElementById('input-form');

    filterForm.append(studentFilterForm.form);
    inputForm.append(studentForm.form);

    const {clearButton, ...otherFilter} = studentFilterForm;

    Object.values(otherFilter).forEach(input => input.addEventListener('input', applyFilters));
    
    studentFilterForm.clearButton.addEventListener('click', (e) => {
        e.preventDefault();

        Object.values(otherFilter).forEach(input => input.value = '');

        applyFilters();
    })

    const {button, ...other} = studentForm;

    Object.values(other).forEach(input => input.addEventListener('input', handleInputChange));

    handleInputChange();

    studentForm.form.addEventListener('submit', (e) => {
        e.preventDefault();

        studentForm.button.disabled = true;

        let row = createStudent(studentForm);

        if (!row) {
            studentForm.button.disabled = false;
            alert('ФИО должно состоять из 3 слов')
            return;
        }

        tableBody.append(row);
        Object.values(other).forEach(input => input.value = '');
    })
});