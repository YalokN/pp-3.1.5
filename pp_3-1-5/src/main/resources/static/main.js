"use strict";

const url = "http://localhost:8080/hz"

async function getAuth() {
    let page = await fetch("http://localhost:8080/user");
    if (page.ok) {
        let auth = await page.json();
        let roles = [];
        for (let role of auth.roles) {
            roles.push(role.name)
        }
        console.log(roles)
        if (roles.includes("ROLE_ADMIN")) {
            let adminLi = document.getElementById('adminLi');
            let adminTab = document.getElementById('adminTab');
            let userLi = document.getElementById('userLi')
            let userTab = document.getElementById('userTab');
            adminLi.classList.add('active');
            adminLi.ariaSelected = "true";
            adminTab.classList.add('active', 'show')
            userLi.classList.remove('active');
            userLi.ariaSelected = "false";
            userTab.classList.remove('active', 'show');
            getPage();
            addNewUser.addEventListener('submit', addNewUserFunc)
        } else if (roles == "ROLE_USER") {
            let userLi = document.getElementById('userLi')
            let userTab = document.getElementById('userTab');
            userLi.classList.add('active');
            userLi.ariaSelected = "true";
            userTab.classList.add('active', 'show');
            loadUserTable();
        }
    } else {
        alert(`Error`)
    }
}

async function getPage() {
    let page = await fetch(url);
    if (page.ok) {
        let allUsers = await page.json();
        allUserTable(allUsers);
    } else {
        alert(`Error`)
    }
}

getAuth();

window.addEventListener('DOMContentLoaded', authUser);

const addNewUser = document.getElementById("newUserForm");

const form_edit = document.getElementById('form_edit');
const id_edit = document.getElementById('id_edit');
const firstName_edit = document.getElementById('firstName_edit');
const lastName_edit = document.getElementById('lastName_edit');
const age_edit = document.getElementById('age_edit');
const email_edit = document.getElementById('email_edit');
const password_edit = document.getElementById('password_edit');

const form_delete = document.getElementById('form_delete');
const id_delete = document.getElementById('id_delete');
const firstName_delete = document.getElementById('firstName_delete');
const lastName_delete = document.getElementById('lastName_delete');
const age_delete = document.getElementById('age_delete');
const email_delete = document.getElementById('email_delete');
const password_delete = document.getElementById('password_delete');

function allUserTable(listAllUser) {
    let adminLi = document.getElementById('adminLi');
    let adminTab = document.getElementById('adminTab');
    let userLi = document.getElementById('userLi')
    let userTab = document.getElementById('userTab');
    adminLi.classList.add('active');
    adminLi.ariaSelected = "true";
    adminTab.classList.add('active', 'show')
    userLi.classList.remove('active');
    userLi.ariaSelected = "false";
    userTab.classList.remove('active', 'show');
    let tableBody = document.getElementById('tbody');
    let dataHtml = '';
    for (let user of listAllUser) {
        let roles = [];
        for (let role of user.roles) {
            roles.push(" " + role.name.replace("ROLE_", ""));
        }
        dataHtml +=
            `<tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>${user.lastName}</td>
    <td>${user.age}</td>
    <td>${user.email}</td>
    <td>${roles}</td>
    <td>
        <button class="btn btn-info" data-toggle="modal"
        data-bs-target="#editModal"
        onclick="editModalData(${user.id})">Edit</button>
    </td>
        <td>
        <button class="btn btn-danger" data-bs-toogle="modal"
        data-bs-target="#deleteModal"
        onclick="deleteModalData(${user.id})">Delete</button>
    </td>
</tr>`
    }
    tableBody.innerHTML = dataHtml;
}

async function loadUserTable() {
    let tableBody = document.getElementById('tbodyUser');
    let page = await fetch("http://localhost:8080/user");
    let currentUser;
    if (page.ok) {
        currentUser = await page.json();
    } else {
        alert(`Error, ${page.status}`)
    }
    let dataHtml = '';
    let roles = [];
    for (let role of currentUser.roles) {
        roles.push(" " + role.name.replace("ROLE_", ""))
    }
    dataHtml +=
        `<tr>
    <td>${currentUser.id}</td>
    <td>${currentUser.username}</td>
    <td>${currentUser.lastName}</td>
    <td>${currentUser.age}</td>
    <td>${currentUser.email}</td>
    <td>${roles}</td>
</tr>`
    tableBody.innerHTML = dataHtml;
    let adminLi = document.getElementById('adminLi');
    let adminTab = document.getElementById('adminTab');
    let userLi = document.getElementById('userLi')
    let userTab = document.getElementById('userTab');
    adminLi.classList.remove('active');
    adminLi.ariaSelected = "false";
    adminTab.classList.remove('active', 'show')
    userLi.classList.add('active');
    userLi.ariaSelected = "true";
    userTab.classList.add('active', 'show');
}

async function addNewUserFunc(event) {
    event.preventDefault();
    let listOfRole = [];
    for (let i = 0; i < addNewUser.roleSelect.options.length; i++) {
        if (addNewUser.roleSelect.options[i].selected) {
            listOfRole.push({
                id: addNewUser.roleSelect.options[i].value,
                role: addNewUser.roleSelect.options[i].text
            });
        }
    }
    let method = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: addNewUser.firstName.value,
            lastName: addNewUser.lastName.value,
            age: addNewUser.age.value,
            email: addNewUser.email.value,
            password: addNewUser.password.value,
            roles: listOfRole
        })
    }
    await fetch(url, method).then(() => {
        addNewUser.reset();
        getPage();
        let tableTab = document.getElementById('table-tab');
        let tableDiv = document.getElementById('table');
        let createTab = document.getElementById('create-tab')
        let createDiv = document.getElementById('create');
        tableTab.classList.add('active');
        tableTab.ariaSelected = "true";
        tableDiv.classList.add('active', 'show')
        createTab.classList.remove('active');
        createTab.ariaSelected = "false";
        createDiv.classList.remove('active', 'show');
    })
}

async function editModalData(id) {
    $('#editModal').modal('show');
    let usersPageEd = await fetch(url + "/" + id);
    if (usersPageEd.ok) {
        await usersPageEd.json().then(user => {
            id_edit.value = `${user.id}`;
            firstName_edit.value = `${user.username}`;
            lastName_edit.value = `${user.lastName}`;
            age_edit.value = `${user.age}`;
            email_edit.value = `${user.email}`;
            password_edit.value = `${user.password}`;
        })
    } else {
        alert(`Error, ${usersPageEd.status}`)
    }
}

async function editUser() {
    let listOfRole = [];
    for (let i = 0; i < form_edit.roles_edit.options.length; i++) {
        if (form_edit.roles_edit.options[i].selected) {
            listOfRole.push({
                id: form_edit.roles_edit.options[i].value,
                name: form_edit.roles_edit.options[i].text
            });
        }
    }
    let method = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: form_edit.id_edit.value,
            username: form_edit.firstName_edit.value,
            lastName: form_edit.lastName_edit.value,
            age: form_edit.age_edit.value,
            email: form_edit.email_edit.value,
            password: form_edit.password_edit.value,
            roles: listOfRole
        })
    }
    await fetch(url + "/" + id_edit.value, method).then(() => {
        $('#editCloseBtn').click();
        getPage();
    })
}

async function deleteModalData(id) {
    $('#deleteModal').modal('show');
    let usersDelete = await fetch(url + "/" + id);
    if (usersDelete.ok) {
        await usersDelete.json().then(user => {
            id_delete.value = `${user.id}`;
            firstName_delete.value = `${user.username}`;
            lastName_delete.value = `${user.lastName}`;
            age_delete.value = `${user.age}`;
            email_delete.value = `${user.email}`;
            password_delete.value = `${user.password}`;
        })
    } else {
        alert(`Error, ${usersDelete.status}`)
    }
}

async function deleteUser() {
    let listOfRole = [];
    for (let i = 0; i < form_delete.roles_delete.options.length; i++) {
        if (form_delete.roles_delete.options[i].selected) {
            listOfRole.push({
                id: form_delete.roles_delete.options[i].value,
                name: form_delete.roles_delete.options[i].text
            });
        }
    }
    let method = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: form_delete.id_delete.value,
            username: form_delete.firstName_delete.value,
            lastName: form_delete.lastName_delete.value,
            age: form_delete.age_delete.value,
            email: form_delete.email_delete.value,
            password: form_delete.password_delete.value,
            roles: listOfRole
        })
    }
    await fetch(url + "/" + id_delete.value, method).then(() => {
        $('#deleteCloseBtn').click();
        getPage();
    })
}

async function authUser() {
    let res = await fetch("http://localhost:8080/user");
    let resUser = await res.json();
    userInfo(resUser);
}

function userInfo(resUser) {
    let userList = document.getElementById('userInfoHtml');
    let roles = ''
    for (let role of resUser.roles) {
        roles += role.name.replace("ROLE_", "") + ' '
    }
    userList.insertAdjacentHTML('beforeend', `
        ${resUser.username} with roles: ${roles}`);
}