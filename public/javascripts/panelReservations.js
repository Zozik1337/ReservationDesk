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

async function reservationCancelModal(){
    document.getElementById("cancelReservationDiv").innerHTML = ``;
    await $.get(`${ip}/userReservationsName/${firstname}/${lastname}`,async function(data, status){
        for(let i = 0;i < data.length; i++){
            document.getElementById("cancelReservationDiv").innerHTML += `<div class="row" id="${data[i].data_rezerwacji.slice(0,10)}" style="text-align: center;"><div class="col-md-2">${data[i].nr_biurka}</div><div class="col-md-8">${data[i].data_rezerwacji.slice(0,10)}</div><div class="col-md-2"><i id="iks" class="fa-solid fa-xmark" onclick='removeReservations(${data[i].nr_biurka},"${data[i].data_rezerwacji.slice(0,10)}","${firstname}","${lastname}")'></i></div></div>`
        }
    });
}

async function removeReservations(deskId,date,firstname,lastname){
    await $.post(`${ip}/removeUserReservation`,{firstname: firstname, lastname: lastname, date: date, deskId: deskId},async function(data, status){
        document.getElementById(`${date}`).remove();
    });
}