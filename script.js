let transactions = JSON.parse(localStorage.getItem("data")) || [];
let editIndex = -1;

/* ================= ADD TRANSACTION ================= */

function addTransaction(){

let desc = document.getElementById("desc").value;
let amount = document.getElementById("amount").value;
let type = document.getElementById("type").value;
let category = document.getElementById("category").value;

if(desc === "" || amount === ""){
alert("Please fill all fields");
return;
}

let obj = {
desc,
amount,
type,
category,
date:new Date().toLocaleDateString(),
month:new Date().getMonth()+1
};

if(editIndex === -1){
transactions.push(obj);
}else{
transactions[editIndex] = obj;
editIndex = -1;
}

localStorage.setItem("data",JSON.stringify(transactions));

display();

}

/* ================= DELETE ================= */

function deleteTransaction(index){

transactions.splice(index,1);

localStorage.setItem("data",JSON.stringify(transactions));

display();

}

/* ================= EDIT ================= */

function editTransaction(index){

let t = transactions[index];

document.getElementById("desc").value = t.desc;
document.getElementById("amount").value = t.amount;
document.getElementById("type").value = t.type;
document.getElementById("category").value = t.category;

editIndex = index;

}

/* ================= DISPLAY ================= */

function display(){

let list = document.getElementById("list");

list.innerHTML="";

let income = 0;
let expense = 0;

transactions.forEach((t,i)=>{

if(t.type === "income"){
income += Number(t.amount);
}else{
expense += Number(t.amount);
}

let row = `
<tr>
<td>${t.desc}</td>
<td>${t.amount}</td>
<td>${t.type}</td>
<td>${t.category}</td>
<td>${t.date}</td>
<td><button onclick="editTransaction(${i})">Edit</button></td>
<td><button onclick="deleteTransaction(${i})">Delete</button></td>
</tr>
`;

list.innerHTML += row;

});
/*
animateValue("income",0,income,500);
animateValue("expense",0,expense,500);
animateValue("balance",0,income-expense,500);
*/
document.getElementById("income").innerText = income;
document.getElementById("expense").innerText = expense;
document.getElementById("balance").innerText = income - expense;

updateChart();
incomeExpenseChart();
categoryChart();

}

/* ================= MONTHLY BAR CHART ================= */

function updateChart(){

let months = new Array(12).fill(0);

transactions.forEach(t=>{
months[t.month-1] += Number(t.amount);
});

let ctx = document.getElementById("chart");

if(window.myChart){
window.myChart.destroy();
}

window.myChart = new Chart(ctx,{

type:'bar',

data:{
labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],

datasets:[{
label:"Monthly Spending",
data:months,
backgroundColor:[
"#ff6384","#36a2eb","#ffce56","#4bc0c0",
"#9966ff","#ff9f40","#8dd1e1","#d4a5a5",
"#a8e6cf","#ffd3b6","#ffaaa5","#c7ceea"
],
borderRadius:8
}]
},

options:{
responsive:true,
animation:{
duration:1500,
easing:'easeOutBounce'
},
scales:{
y:{
beginAtZero:true
}
}
}

});

}

/* ================= INCOME VS EXPENSE ================= */

function incomeExpenseChart(){

let income = 0;
let expense = 0;

transactions.forEach(t=>{
if(t.type === "income"){
income += Number(t.amount);
}else{
expense += Number(t.amount);
}
});

let ctx = document.getElementById("incomeExpenseChart");

if(window.doughnutChart){
window.doughnutChart.destroy();
}

window.doughnutChart = new Chart(ctx,{

type:'doughnut',

data:{
labels:["Income","Expense"],
datasets:[{
data:[income,expense],
backgroundColor:["#4CAF50","#FF6384"]
}]
}

});

}

/* ================= CATEGORY PIE CHART ================= */

function categoryChart(){

let categories = {
Food:0,
Travel:0,
Shopping:0,
Bills:0,
"Online Payment":0
};

transactions.forEach(t=>{
if(t.type === "expense"){
categories[t.category] += Number(t.amount);
}
});

let ctx = document.getElementById("categoryChart");

if(window.pieChart){
window.pieChart.destroy();
}

window.pieChart = new Chart(ctx,{

type:'pie',

data:{
labels:Object.keys(categories),
datasets:[{
data:Object.values(categories),
backgroundColor:[
"#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF"
]
}]
}

});

}

/* ================= COUNTER ANIMATION ================= */

function animateValue(id,start,end,duration){

if(start === end){
document.getElementById(id).innerText = end;
return;
}

let range = end - start;
let current = start;
let increment = end > start ? 1 : -1;
let stepTime = Math.abs(Math.floor(duration / Math.abs(range)));

let obj = document.getElementById(id);

let timer = setInterval(function(){

current += increment;
obj.innerText = current;

if(current === end){
clearInterval(timer);
}

},stepTime);

}

/* ================= SEARCH ================= */

function searchTransaction(){

let input = document.getElementById("search").value.toLowerCase();

let rows = document.querySelectorAll("#list tr");

rows.forEach(row =>{

let text = row.innerText.toLowerCase();

row.style.display = text.includes(input) ? "" : "none";

});

}

/* ================= FILTER ================= */

function filterCategory(category){

let rows = document.querySelectorAll("#list tr");

rows.forEach(row=>{

if(category === "all"){
row.style.display="";
}else{

let cell = row.children[3].innerText;

row.style.display = cell === category ? "" : "none";

}

});

}

/* ================= DARK MODE ================= */

function toggleTheme(){
document.body.classList.toggle("dark");
}

/* ================= INITIAL LOAD ================= */

display();