//Read/Add/Delete/Update a student list Fetch and REST API

var studentsAPI = "http://localhost:3000/students";

function start() {
    getStudents(renderStudents);
    handleCreateForm();
}
start();

//1.GET: Get the list of students
function getStudents(callback) {
    fetch(studentsAPI)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

function renderStudents(students) {
    var studentList = document.getElementById("student-list");

    var htmls = students.map(function (student) {
        return `
            <li class="student-item-${student.id}">
                <h4>${student.name}</h4>
                <p>${student.address}</p>
                <button onclick="deleteStudent(${student.id})">Delete</button>
                <button id="edit-btn" onclick="handleUpdate(${student.id}, '${student.name}','${student.address}')">Edit</button>
            </li>
        `;
    });

    studentList.innerHTML = htmls.join("");
}

//2. POST: Create a student
function createStudent(data, callback) {
    fetch(studentsAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            return res.json();
        })
        .then(callback);
}

function handleCreateForm() {
    var createBtn = document.getElementById("create-btn");

    createBtn.onclick = function () {
        //get value of input
        var name = document.querySelector('input[name="name"]').value;
        var address = document.querySelector('input[name="address"]').value;

        //click to create to get data from input
        var formData = {
            name: name,
            address: address,
        };

        if (formData.name && formData.address) {
            createStudent(formData, renderStudents);
        }
    };
}

//3. DELETE: a student
function deleteStudent(id, callback) {
    fetch(`${studentsAPI}/${id}`, {
        method: "DELETE",
    }).then(function() {
        //delete directly an element in DOM instead of rendering a list
        var studentItem = document.querySelector('.student-item-' + id);
            if (studentItem) {
                studentItem.remove();
            }
        });
}

//4.PATCH Update a student
function handleUpdate(id, name, address) {
    var nameInput = document.querySelector('input[name="name"]');
    var addressInput = document.querySelector('input[name="address"]');

    nameInput.value = name;
    addressInput.value = address;

    var createBtn = document.getElementById("create-btn");
    createBtn.innerText = "Save";

    createBtn.onclick = function () {
        var formData = {
            name: nameInput.value,
            address: addressInput.value,
        };

        updateStudent(id, formData, renderStudents);
    };
}

function updateStudent(id, data, callback) {
    fetch(`${studentsAPI}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            return res.json();
        })
        .then(callback);
}
