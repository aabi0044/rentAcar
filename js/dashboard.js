
function fetchCars() {
    fetch('http://localhost:3000/cars').then(response => response.json())
        .then(myJson => {
            allcars = myJson;
            const booked = allcars.filter(c => c.booked)
            const free = allcars.filter(c => !c.booked)
            document.getElementById('tBooked').innerText = booked.length;
            document.getElementById('tFree').innerText = free.length
            renderCard(myJson)
            return true;
        })
}
var allcars = null;
var selectedCard = null;
var selectedOrder;



function submitCar() {
    var element = document.getElementById('form-error');
    var name = document.getElementById('name').value;
    var model = document.getElementById('model').value;
    var number = document.getElementById('number').value;
    var color = document.getElementById('color').value;
    var eng = document.getElementById('eng').value;
    var chases = document.getElementById('chases').value;
    var owner = document.getElementById('owner').value;
    console.log(name, model)
    if (name === "" || model === "") {
        console.log("object")
        element.classList.add("show-error")
        element.classList.remove("hide-error")
    } else {
        element.classList.remove("show-error")
        element.classList.add("hide-error")
        const finalObj = { name, model, color, eng, chases, owner, number, booked: false }

        return fetch('http://localhost:3000/cars', {
            method: 'POST',
            headers: {
                'Accept': 'application/json ,text/plain ',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(finalObj)
        }).then(res => {
            fetchCars()
            document.getElementById('closeModal').click();
            resetAddForm()
        }).catch(err => {
            console.log("err", err)
            element.classList.add("show-error")
            element.classList.remove("hide-error")
            element.innerText = "Database Error ! Please close and run Database again"
        })
    }

}
function goTORecords() {
    window.location.href = "main-records.html";
}
function createOrder() {
    var element = document.getElementById('order-form-error');
    var dutyandplace = document.getElementById('dutyandplace').value;
    var sdate = document.getElementById('sdate').value;
    var amount = document.getElementById('amount').value;
    var td = document.getElementById('td').value;
    var co = document.getElementById('co').value;
    var remarks = document.getElementById('remarks').value;
    var pname = document.getElementById('pname').value;
    var pnumber = document.getElementById('pnumber').value;
    var pid = document.getElementById('pid').value;
    const finalObj = {
        dutyandplace,
        sdate,
        adate: "",
        amount,
        td,
        ta: "",
        pname,
        pnumber,
        pid,
        co,
        remarks,
        carId: selectedCard.id
    };
    console.log(finalObj)
    if (dutyandplace === "" || sdate === "" || td === "") {
        element.classList.add("order-show-error")
        element.classList.remove("order-hide-error")
    } else {

        element.classList.remove("order-show-error")
        element.classList.add("order-hide-error")
        return fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Accept': 'application/json ,text/plain ',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(finalObj)
        }).then(response => response.json())
            .then(res => {
                updateCarStatus(true, res.id);
                resetOrderForm()
            }).catch(err => {
                console.log("err", err)
                element.classList.add("show-error")
                element.classList.remove("hide-error")
                element.innerText = "Database Error ! Please close and run Database again"
            })
    }
}

function updateCarStatus(booked, orderId) {
    console.log("selectedCard", selectedCard)
    selectedCard.booked = booked;
    selectedCard.orderId = orderId;
    let url = `http://localhost:3000/cars/${selectedCard.id}`
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedCard)
    }).then(async data => {
        await fetchCars()
        document.getElementById('createOrderModal').click();
    })
}
function searchCars() {
    var value = document.getElementById('searchValue').value;
    var filteredResult = allcars.filter(item => item.number.toLowerCase().includes(value.toLowerCase()));

    renderCard(filteredResult)
}
function resetAddForm() {
    document.getElementById('name').value = null;
    document.getElementById('model').value = null;
    document.getElementById('number').value = null;
    document.getElementById('color').value = null;
    document.getElementById('eng').value = null;
    document.getElementById('chases').value = null;
    document.getElementById('owner').value = null;
}

function resetOrderForm() {
    document.getElementById('dutyandplace').value = null;
    document.getElementById('sdate').value = null;
    document.getElementById('amount').value = null;
    document.getElementById('ta').value = null;
    document.getElementById('co').value = null;
    document.getElementById('remarks').value = null;
    document.getElementById('pname').value = null;
    document.getElementById('pnumber').value = null;
    document.getElementById('pid').value = null;
}

function clearSearch() {
    renderCard(allcars)
}

async function handleCarCard(idx) {
    const filteredCar = allcars.filter(c => c.id === idx)[0];
    selectedCard = filteredCar;
    if (filteredCar.booked) {
        const order = await orderDetails(filteredCar.orderId);
        selectedOrder = order;
        document.getElementById("updateCarModal").click();
        var modalBody = document.getElementById("update-modal-content");
        const data = `
        <form>
        <div class="container">
        <div class="row">
        <div class="col-md-12 text-center">
            <h3 style="font-weight: bold"> ${selectedCard.name.toUpperCase()} | ${selectedCard.number.toUpperCase()} (${selectedCard.model})</h3>
           <p></p>
        </div>
        </div>
         </div>
    
        <div class="row">
            <div class="col-md-3 ">
                <div class="form-group d-flex">
                    <label style="white-space:nowrap">Duty and place: </label>
                    <span class="update-info-feild ml-1"> ${order.dutyandplace}</span>
                </div>
            </div>

            <div class="col-md-3 ">
            <div class="form-group d-flex">
                <label style="white-space:nowrap">Issue Date:  </label>
                <span class="update-info-feild ml-1"> ${order.sdate}</span>
            </div>
        </div>
        <div class="col-md-3">
        <div class="form-group d-flex">
            <label>Amount: </label>
            <span class="update-info-feild ml-1"> ${order.amount}</span>
        </div>
    </div>
    <div class="col-md-3">
    <div class="form-group d-flex">
        <label>T/D: </label>
        <span class="update-info-feild ml-1"> ${order.td}</span>
    </div>
</div>

<div class="col-md-3">
<div class="form-group d-flex">
    <label>Phone#: </label>
    <span class="update-info-feild ml-1" > ${order.pnumber}</span>
</div>
</div>
<div class="col-md-3">
<div class="form-group d-flex">
    <label>Name: </label>
    <span class="update-info-feild ml-1"> ${order.pname}</span>
</div>
</div>

<div class="col-md-3">
<div class="form-group d-flex">
    <label>ID#: </label>
    <span class="update-info-feild ml-1"> ${order.pid}</span>
</div>
</div>


<div class="col-md-3">
<div class="form-group d-flex">
    <label>C/O: </label>
    <span class="update-info-feild ml-1"> ${order.co}</span>
</div>
</div>

<div class="col-md-12">
<div class="form-group d-flex">
    <label>Remarks: </label>
    <span class="update-info-feild ml-1"> ${order.remarks}</span>
</div>
</div>
         
        </div>
        <div class="row">
        <div class="col-md-6 ">
        <div class="form-group">
        <label>Date</label>
        <input id="adate" type="date" class="form-control date-time" >
    </div>
        </div>
        <div class="col-md-6 ">
        <div class="form-group">
            <label>T/A</label>
            <input id="ta" type="time" class="form-control date-time" >
        </div>
    </div>
     
    </div>
        <div class="row">
        <div class="col-md-12 text-center ">
        <span id="update-form-error" class="error update-hide-error">
        Please enter valid data
    </span>
        </div>
        </div>
    </form>
        `; modalBody.innerHTML = data
    } else {
        document.getElementById("issueCarModal").click();
        var modalBody = document.getElementById("issue-modal-content");
        const data = `
        <form>
        
        <div class="row">
            <div class="col-md-12 ">
                <div class="form-group">
                    <label>Duty and place </label>
                    <input id="dutyandplace" type="text" class="form-control" placeholder="Duty and place">
                </div>
            </div>
         
        </div>
        <div class="row">
        <div class="col-md-6 ">
        <div class="form-group">
        <label>Date</label>
        <input id="sdate" type="date" class="form-control date-time" >
    </div>
        </div>
        <div class="col-md-6 ">
        <div class="form-group">
        <label>Amount</label>
        <input id="amount" type="number" min="0" class="form-control" >
    </div>
        </div>
     
    </div>

        <div class="row">
       

            <div class="col-md-6 ">
                <div class="form-group">
                    <label>T/D</label>
                    <input id="td" type="time" class="form-control date-time" >
                </div>
            </div>
            <div class="col-md-6 ">
                <div class="form-group">
                    <label>Person Number</label>
                    <input id="pnumber" type="text" placeholder="Phone number" class="form-control date-time" >
                </div>
            </div>
         
        </div>

        <div class="row">
       

        <div class="col-md-6 ">
            <div class="form-group">
                <label>person Name</label>
                <input id="pname" type="text" placeholder="Person name" class="form-control date-time" >
            </div>
        </div>
        <div class="col-md-6 ">
            <div class="form-group">
                <label>ID Card Number</label>
                <input id="pid" type="text" placeholder="ID Card number" class="form-control date-time" >
            </div>
        </div>
     
    </div>
        <div class="row">
            <div class="col-md-12 ">
                <div class="form-group">
                    <label>C/O</label>
                    <input id="co" type="text" class="form-control" placeholder="Ref person">
                </div>
            </div>
         
        </div>
        <div class="row">
            <div class="col-md-12 ">
                <div class="form-group">
                    <label>Remarks</label>
                    <textarea id="remarks" rows="4" type="text" class="form-control" placeholder="Remarks"></textarea>
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
    }


}
function orderDetails(id) {
    return fetch(`http://localhost:3000/orders/${id}`).then(res => res.json())
}


function closeOrder() {
    var element = document.getElementById('update-form-error');
    var ta = document.getElementById('ta').value;
    var adate = document.getElementById('adate').value;
    if(ta==="" || adate===""){
        element.classList.add("update-show-error")
        element.classList.remove("update-hide-error")
    }else{
        element.classList.remove("update-show-error")
        element.classList.add("update-hide-error")
        selectedOrder.ta = ta; selectedOrder.adate = adate;
        let url = `http://localhost:3000/order/${selectedOrder.id}`
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedOrder)
        }).then(async data => {
            updateCarStatus(false, selectedOrder.id)
            document.getElementById('udpateModel').click();
        })
    }
 
}

function renderCard(inputData) {
    let data = ''
    inputData.forEach((item, idx) => {
        data = data + `<div class="col-md-3">
        <div onclick="handleCarCard(${item.id})" class="card status-card ${item.booked ? 'booked' : 'not-booked'} ">
             <div class="card-header ${item.booked ? 'booked' : 'not-booked'} ">
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

    document.getElementById('cars-row').innerHTML = data
}
