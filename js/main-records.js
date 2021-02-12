function goToHome() {
    window.location.href = "dashboard.html";
}
var allcars;
var selectedCard;
var allRecords;
var tableData;
function allRecords() {

}

function fetchCars() {

    fetch('http://localhost:3000/cars').then(response => response.json())
        .then(myJson => {
            allcars = myJson;
            renderCard(myJson)
            fetchRecords()
            return true;
        })
}
function fetchRecords() {
    fetch('http://localhost:3000/orders').then(response => response.json())
        .then(myJson => {
            allRecords = myJson;
        })
}


function renderCard(inputData) {
    let data = ''
    inputData.forEach((item, idx) => {
        data = data + `<div class="col-md-3">
        <div onclick="handleCarCard(${item.id})" class="card ">
             <div class="card-header status-card ${item.booked ? 'booked' : 'not-booked'} ">
                  <h3 class="card-title title-strong">${item.number.toUpperCase()}</h3>
                 <p class="card-category"  style="color:#6a6767 !important">${item.name.toUpperCase()} <strong style="color:black">( ${item.model} )</strong></p>
                 <div class="stats" style="color:#6a6767 !important">
                  ${item.color.toUpperCase()}
                </div>
                <hr>
                 </div>
            </div>
            </div>`
    })

    document.getElementById('cars-rows').innerHTML = data
}


function handleCarCard(idx) {
    const filteredCar = allcars.filter(c => c.id === idx)[0];
    selectedCard = filteredCar;
    SingleCarRecords()
}

function SingleCarRecords() {
    const resp = allRecords.filter(r => r.carId === selectedCard.id);
    resp.map(record => (

        record.number = selectedCard.number,
        record.model = selectedCard.model,
        record.name = selectedCard.name,
        record.color = selectedCard.color

    ))
    document.getElementById('card-title').innerText = `${selectedCard.name.toUpperCase()} | ${selectedCard.number} | ${selectedCard.model} | ${selectedCard.color}`
    renderTable(resp)
}
async function allRecordsHandler() {
    document.getElementById('card-title').innerText = "ALL CARS DATA"
    await allRecords.map(record => {
        const car = allcars.filter(car => car.id === record.carId)[0]
        record.number = car.number,
            record.model = car.model,
            record.name = car.name,
            record.color = car.color
    })
    renderTable(allRecords)

}
function searchRecords() {

    const searchText = document.getElementById("searchRecordValue").value;
    console.log(searchText);
    console.log(tableData);
}
function renderTable(data) {
    tableData = data;
    var tableelem = document.getElementById('table-content');
    var carselem = document.getElementById('cars-rows');
    let tableData = "";
    data.forEach((item, idx) => {
        tableData = tableData + `
        <tr>
        <td>${idx + 1}</td>
        <td>${item.name} | <strong style="color:blue">${item.number}</strong> (${item.model})</td>
        <td>${item.pname}</td>
        <td>${item.pnumber}</td>    
        <td>${item.pid}</td>
        <td>${item.dutyandplace}</td>
        <td>${item.sdate}</td>
        <td>${item.td}</td>
        <td>${item.ta}</td>
        <td>${item.co}</td>
        <td>${item.amount}</td>
        <td>${item.remarks}</td>

    </tr>
     
        `
    })
    tableelem.classList.remove("hide-table")
    tableelem.classList.add("show-table")
    carselem.classList.remove("show-cars")
    carselem.classList.add("hide-cars")
    console.log(tableData)
    document.getElementById('tableData').innerHTML = tableData
}

function backToCards() {
    var tableelem = document.getElementById('table-content');
    var carselem = document.getElementById('cars-rows');
    tableelem.classList.add("hide-table")
    tableelem.classList.remove("show-table")
    carselem.classList.add("show-cars")
    carselem.classList.remove("hide-cars")
}