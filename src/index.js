import './style.css';
const {format} = require('date-fns');

const todos = (title,description,dueDate,priority) => {
    return { title, description, dueDate, priority };
}

const projects = (title) => {
    return { projectTitle:title, todos:[] };
}

//which project is chosen
let pChosen = 0;

//which todo is chosen
let tChosen = 0;

//add Todo btn
const addTask = document.querySelector('.addTask');

//goto inbox btn
const inboxBtn = document.querySelector('.inboxBtn');const today =format(new Date(),'do MMM');

//add Project btn
const addProject = document.querySelector('.addProject');


//div below add todo btn where all todo of every project will be shown
const selectedProject = document.querySelector('.selectedProject');

//create a inbox div
const inbox = document.createElement('div');
//h2 inbox
const inboxH2 = document.createElement('h2');
inboxH2.textContent = "Inbox";
inbox.appendChild(inboxH2);

//projects div
const divProject = document.querySelector('.divProject');

//new todo modal
const favDialog = document.getElementById('favDialog');
const title = document.getElementById('title');
const desc = document.getElementById('description');
const dueDate = document.getElementById('date');
const select = document.getElementById('select');
const confirmBtn = document.getElementById('confirmBtn');

//new project modal
const newDialog = document.getElementById('newDialog');
//add btn of new project modal
const addBtn = document.getElementById('addBtn');
//title of project modal
const Ptitle = document.getElementById('Ptitle');


//show todo modal
const showDialog = document.getElementById('showDialog');
const showForm = document.querySelector('.showForm');


//edit modal
const editDialog = document.getElementById('editDialog');
const submitBtn = document.getElementById('submitBtn');
const Etitle = document.getElementById('Etitle');
const Edesc = document.getElementById('Edesc');
const Edate = document.getElementById('Edate');
const Eselect = document.getElementById('Eselect');

//array to store new projects
let myProjects = [
    {
        projectTitle:'inbox',
        todos:[]
    },
];


inboxBtn.addEventListener('click',() => {
    pChosen = 0;
    selectedProject.replaceChildren(inbox);
    showTodo(0);
});


addProject.addEventListener('click',() => {
    newDialog.showModal();
});


addBtn.addEventListener('click',(event) => {
    event.preventDefault();
    pushProject();
    populateStorage();
    newProject();
    newDialog.close();
})


function pushProject () {
    let newP = projects(Ptitle.value);
    myProjects.push(newP);
}


function newProject() {

    divProject.replaceChildren();

    for(let i=1;i<myProjects.length;i++){

        const divNewProject = document.createElement('div');
        divNewProject.classList.add('divNewProject');

        const divPtitle = document.createElement('div');
        divPtitle.classList.add('divPtitle');
        divPtitle.textContent = myProjects[i].projectTitle;
        divPtitle.addEventListener('click',()=>{showTodo(i)});

        const divPclose = document.createElement('button');
        divPclose.classList.add('divPclose');
        divPclose.textContent = 'X';
        divPclose.addEventListener('click',()=>{remove(i)});

        divProject.appendChild(divNewProject);
        divNewProject.appendChild(divPtitle);
        divNewProject.appendChild(divPclose);

    }
}


function remove(index) {
    myProjects.splice(index,1);
    populateStorage();
    newProject();
}


function showTodo(index) {

    pChosen = index;
    selectedProject.replaceChildren();

    for(let i=0;i<myProjects[index].todos.length;i++){

        const parent = document.createElement('div');
        parent.classList.add('parent');

        const left = document.createElement('div');
        left.classList.add('left');

        const right = document.createElement('div');
        right.classList.add('right');

        const box = document.createElement('input');
        box.classList.add('box');
        box.setAttribute('type','checkbox');

        const name = document.createElement('label');
        name.classList.add('name');
        name.textContent = myProjects[index].todos[i].title;

        const details = document.createElement('button');
        details.classList.add('details');
        details.textContent = 'DETAILS';
        details.addEventListener('click',()=>{showDetails(i)});

        const showDate = document.createElement('div');
        showDate.classList.add('showDate');
        const today = format(new Date(myProjects[index].todos[i].dueDate),'do MMM');
        showDate.textContent = today; 

        const edit = document.createElement('button');
        edit.classList.add('edit');
        edit.textContent = "Edit";
        edit.addEventListener('click',()=>{openEditModal(i)});

        const del = document.createElement('button');
        del.classList.add('del');
        del.textContent = 'X';
        del.addEventListener('click',()=>{removeTodo(i)});

        selectedProject.appendChild(parent);
        parent.appendChild(left);
        parent.appendChild(right);
        left.appendChild(box);
        left.appendChild(name);
        right.appendChild(details);
        right.appendChild(showDate);
        right.appendChild(edit);
        right.appendChild(del);

    }
};


addTask.addEventListener('click',() => {
    favDialog.showModal();
});


confirmBtn.addEventListener('click',(event) => {
    event.preventDefault();
    let newT = todos(title.value,desc.value,dueDate.value,select.value);
    pushTodo(newT);
    populateStorage();
    showTodo(pChosen);
    favDialog.close();
});


function pushTodo(object){
    myProjects[pChosen].todos.push(object);
}

function showDetails(i) {
  showDialog.showModal();
  renderDetails(i);
}

function renderDetails(i){

    showForm.replaceChildren();

    const info = document.createElement('p');
    info.classList.add('info');
    info.textContent =  `Description: ${myProjects[pChosen].todos[i].description}`;

    const importance = document.createElement('p');
    importance.classList.add('importance');
    importance.textContent = `Priority: ${myProjects[pChosen].todos[i].priority}`;

    showForm.appendChild(info);
    showForm.appendChild(importance);
}


function openEditModal(i) {
    editDialog.showModal();
    tChosen = i;
}


submitBtn.addEventListener('click',(event) => {
    event.preventDefault();
    newTodo(tChosen,Etitle,Edesc,Edate,Eselect);
    populateStorage();
    editDialog.close();
})


function newTodo(i,title,desc,date,select) {
    myProjects[pChosen].todos[i].title = title.value;
    myProjects[pChosen].todos[i].description = desc.value;
    myProjects[pChosen].todos[i].dueDate = date.value;
    myProjects[pChosen].todos[i].priority = select.value;
    showTodo(pChosen);
}

function removeTodo(i) {
    myProjects[pChosen].todos.splice(i,1);
    populateStorage();
    showTodo(pChosen);
}


//function that saves the project and todo to localStorage when they are created
function populateStorage(){
    localStorage.setItem("myProjects",JSON.stringify(myProjects));
}



//function that looks for data in localStorage when app is loaded
window.addEventListener('load',()=>{
    myProjects = JSON.parse(localStorage.getItem("myProjects"));
    newProject();
    showTodo(0);
})