const ip = 'http://192.168.43.172:3000';

getData();

async function getData(){
    await $.get(`${ip}/getusers/`,async function(data, status){
        data.forEach(e => {
            document.getElementById("user").innerHTML += `<div class="row" style="text-align: left; margin-bottom: 15px;"><div class="col-md-5"><i class="fa-solid fa-user fa-2xl" style="float: right; margin-top: 13px" onclick='reservationCancelModal("${e.imie}","${e.nazwisko}")' data-bs-toggle="modal" data-bs-target="#modalreseravtion"></i></div><div class="col-md-7" style="font-size: 18px;">${e.imie} ${e.nazwisko}</div></div>`
        });
    });
    await $.get(`${ip}/getalldesks/`,async function(data, status){
        data.forEach(e => {
            document.getElementById("desk").innerHTML += `<div class="row" style="text-align: right; margin-bottom: 15px;"><div class="col-md-6"><i class="fa-solid fa-calendar-check fa-2xl" style="float: right; margin-top: 13px" onclick='reservationDeskCancelModal("${e.nr_biurka}")' data-bs-toggle="modal" data-bs-target="#modaldeskreseravtion"></i></div><div class="col-md-6" style="font-size: 18px; text-align: left;">${e.nr_biurka}</div></div>`
        });
    });
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

async function reservationCancelModal(firstname, lastname){
    document.getElementById("cancelReservationDiv").innerHTML = ``;
    await $.get(`${ip}/userReservationsName/${firstname}/${lastname}`,async function(data, status){
        for(let i = 0;i < data.length; i++){
            document.getElementById("cancelReservationDiv").innerHTML += `<div class="row" id="${data[i].data_rezerwacji.slice(0,10)}" style="text-align: center;"><div class="col-md-2">${data[i].nr_biurka}</div><div class="col-md-8">${data[i].data_rezerwacji.slice(0,10)}</div><div class="col-md-2"><i class="fa-solid fa-xmark" onclick='removeReservations(${data[i].nr_biurka},"${data[i].data_rezerwacji.slice(0,10)}","${firstname}","${lastname}")'></i></div></div>`
        }
    });
}

async function removeReservations(deskId,date,firstname,lastname){
    await $.post(`${ip}/removeUserReservation`,{firstname: firstname, lastname: lastname, date: date, deskId: deskId},async function(data, status){
        document.getElementById(`${date}`).remove();
    });
}

async function reservationDeskCancelModal(deskId){
    document.getElementById("cancelDeskReservationDiv").innerHTML = ``;
    await $.get(`${ip}/reservedDeskNames/${deskId}`,async function(data, status){
        for(let i = 0;i < data.length; i++){
            document.getElementById("cancelDeskReservationDiv").innerHTML += `<div class="row" id="${data[i].data_rezerwacji.slice(0,10)}" style="text-align: center;"><div class="col-md-4">${data[i].imie} ${data[i].nazwisko}</div><div class="col-md-6">${data[i].data_rezerwacji.slice(0,10)}</div><div class="col-md-2"><i id="iks" class="fa-solid fa-xmark" onclick='removeReservations(${deskId},"${data[i].data_rezerwacji.slice(0,10)}","${data[i].imie}", "${data[i].nazwisko}")'></i></div></div>`
        }
    });
}

async function removeDeskReservations(deskId,date,firstname,lastname){
    await $.post(`${ip}/removeUserReservation`,{firstname: firstname, lastname: lastname, date: date, deskId: deskId},async function(data, status){
        document.getElementById(`${date}`).remove();
    });
}