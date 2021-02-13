function goToHome() {
    window.location.href = "dashboard.html";
}
var allcars;
var selectedCard;
var allRecords;
var tableRenderedData;
var selectedRow;


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
    tableRenderedData = resp;
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
    tableRenderedData = allRecords
    renderTable(allRecords)

}

function renderTable(data) {
    var tableelem = document.getElementById('table-content');
    var carselem = document.getElementById('cars-rows');
    let tableData = "";
    data.forEach((item, idx) => {
        tableData = tableData + `
        <tr class="table-rows" onclick="rowOperation(${idx})">
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
        <td><span class="${item.adate !== "" ? "completed" : "pending"}">${item.adate !== "" ? "completed" : "pending"}</span> </td>

    </tr>
     
        `
    })
    tableelem.classList.remove("hide-table")
    tableelem.classList.add("show-table")
    carselem.classList.remove("show-cars")
    carselem.classList.add("hide-cars")
    document.getElementById('tableData').innerHTML = tableData
}
function rowOperation(idx) {
    const order = tableRenderedData[idx];
    selectedRow = order;
    document.getElementById("updateRecordModal").click();
    var modalBody = document.getElementById("update-record-content"); 
    const data = `
    <form>
    
    <div class="row">
        <div class="col-md-12 ">
            <div class="form-group">
                <label>Duty and place </label>
                <input id="udutyandplace" type="text" class="form-control" placeholder="Duty and place">
            </div>
        </div>
     
    </div>
    <div class="row">
    <div class="col-md-6">
    <div class="form-group">
    <label>Delivery Date</label>
    <input id="usdate" type="date" class="form-control date-time" >
</div>
</div>


 
    <div class="col-md-6">
    <div class="form-group">
    <label>Amount</label>
    <input id="uamount" type="number" min="0" class="form-control" >
</div>
    </div>
 
</div>
<div class="row">
${order.adate!==""?`
<div class="col-md-6 ">
<div class="form-group">
<label>Arival Date</label>
<input id="uadate" type="date" class="form-control date-time" >
</div>
   </div>
`:""}

${order.ta!==""?`
<div class="col-md-6 ">
<div class="form-group">
<label>T/A</label>
<input id="uta" type="time" class="form-control date-time" >
</div>
   </div>
`:""}
</div>
    <div class="row">
   

        <div class="col-md-6 ">
            <div class="form-group">
                <label>T/D</label>
                <input id="utd" type="time" class="form-control date-time" >
            </div>
        </div>
        <div class="col-md-6 ">
            <div class="form-group">
                <label>Person Number</label>
                <input id="upnumber" type="text" placeholder="Phone number" class="form-control date-time" >
            </div>
        </div>
     
    </div>

    <div class="row">
   

    <div class="col-md-6 ">
        <div class="form-group">
            <label>person Name</label>
            <input id="upname" type="text" placeholder="Person name" class="form-control date-time" >
        </div>
    </div>
    <div class="col-md-6 ">
        <div class="form-group">
            <label>ID Card Number</label>
            <input id="upid" type="text" placeholder="ID Card number" class="form-control date-time" >
        </div>
    </div>
 
</div>
    <div class="row">
        <div class="col-md-12 ">
            <div class="form-group">
                <label>C/O</label>
                <input id="uco" type="text" class="form-control" placeholder="Ref person">
            </div>
        </div>
     
    </div>
    <div class="row">
        <div class="col-md-12 ">
            <div class="form-group">
                <label>Remarks</label>
                <textarea id="uremarks" rows="4" type="text" class="form-control" placeholder="Remarks"></textarea>
            </div>
        </div>
     
    </div>
    <div class="row">
    <div class="col-md-12 text-center ">
    <span id="order-form-error" class="error order-hide-error">
    Please enter valid data
</span>
    </div>
    </div>
</form>
    `; modalBody.innerHTML = data
    document.getElementById("udutyandplace").value = order.dutyandplace;
    document.getElementById("usdate").value = order.sdate;
    document.getElementById("uamount").value = order.amount;
    document.getElementById("utd").value = order.td;
    document.getElementById("upnumber").value = order.pnumber;
    document.getElementById("upname").value = order.pname;
    document.getElementById("upid").value = order.pid;
    document.getElementById("uco").value = order.co;
    document.getElementById("uremarks").value = order.remarks;
    if(order.ta !== ""){
        document.getElementById("uta").value = order.ta;
    }
    if(order.adate !== ""){
        document.getElementById("uadate").value = order.adate;
    }
}

function updateOrderRow(){
    selectedRow.dutyandplace = document.getElementById("udutyandplace").value ;
    selectedRow.sdate = document.getElementById("usdate").value ;
    selectedRow.amount = document.getElementById("uamount").value ;
    selectedRow.td = document.getElementById("utd").value;
    selectedRow.pnumber = document.getElementById("upnumber").value;
    selectedRow.pname = document.getElementById("upname").value ;
    selectedRow.pid = document.getElementById("upid").value ;
    selectedRow.co = document.getElementById("uco").value;
    selectedRow.remarks = document.getElementById("uremarks").value;
    selectedRow.ta = document.getElementById("uta").value;
    selectedRow.adate = document.getElementById("uadate").value;
console.log(selectedRow)

        let url = `http://localhost:3000/orders/${selectedRow.id}`
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedRow)
        }).then(async data => {
            document.getElementById('udpateRowModel').click();
            fetchRecords()
            var tableelem = document.getElementById('table-content');
            var carselem = document.getElementById('cars-rows');
            tableelem.classList.add("hide-table")
            tableelem.classList.remove("show-table")
            carselem.classList.add("show-cars")
            carselem.classList.remove("hide-cars")
        })
    
}

function searchCarNumRecords() {
    const searchText = document.getElementById("searchcn").value;
    if (searchText === '') {
        console.log(tableRenderedData)
        renderTable(tableRenderedData)
    } else {

        document.getElementById("searchpn").value = '';
        document.getElementById("searchphone").value = "";
        const result = tableRenderedData.filter(item => item.number.toLowerCase().includes(searchText.toLowerCase()));
        renderTable(result)
    }
}

function searchPNameRecords() {
    const searchText = document.getElementById("searchpn").value;
    if (searchText === '') {
        renderTable(tableRenderedData)
    } else {

        document.getElementById("searchcn").value = '';
        document.getElementById("searchphone").value = "";
        const result = tableRenderedData.filter(item => item.pname.toLowerCase().includes(searchText.toLowerCase()));
        renderTable(result)
    }
}

function searchMobileRecords() {
    const searchText = document.getElementById("searchphone").value;
    if (searchText === '') {
        renderTable(tableRenderedData)
    } else {

        document.getElementById("searchpn").value = '';
        document.getElementById("searchcn").value = "";
        const result = tableRenderedData.filter(item => item.pnumber.toLowerCase().includes(searchText.toLowerCase()));
        renderTable(result)
    }
}
function searchRecords() {

    const searchText = document.getElementById("searchRecordValue").value;
    console.log(searchText);
    console.log(tableRenderedData);
    const result = tableRenderedData.filter(item => {
        return item.number.toLowerCase().includes(value.toLowerCase()) || item.pname.toLowerCase().includes(value.toLowerCase()) || item.pnumber.toLowerCase().includes(value.toLowerCase())
    });

    console.log("result", result)
}

function backToCards() {
    var tableelem = document.getElementById('table-content');
    var carselem = document.getElementById('cars-rows');
    tableelem.classList.add("hide-table")
    tableelem.classList.remove("show-table")
    carselem.classList.add("show-cars")
    carselem.classList.remove("hide-cars")
}