const ip = 'http://192.168.43.172:3000';
let names = ["one","two","three","four","five","six"]
let elements = [];
var globalDate = new Date();
let selectedIds = [];
let deskId;
let maxElementsToSelect;


function getNameOfFirstDay(date){
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay();
}

function getDaysInMonth (date){
    let mies = date.getMonth() +1;
    let year = date.getFullYear();
    daysInMonth = new Date(year, mies, 0).getDate();
    return daysInMonth;
}

function getNumberOfWeeks (date){
    let number = getNameOfFirstDay(date);
    let numbermtn = getDaysInMonth (date);
    if (((number == 6 || number == 0) && numbermtn == 31) || (number == 0 && numbermtn==30)){
         return 6;
    }else{
         return 5;
    }
}

function nextPage(){
    nextMonth();
    clearModal();
    generateModal();
    document.getElementById("next").style.display = "none";
    document.getElementById("prev").style.display = "block";
}
async function selectDay(id){
    for(let i = 0;i < selectedIds.length;i++){
        if(selectedIds[i] == id){
            selectedIds.splice(i, 1);
            document.getElementById(id).style.backgroundColor = "white";
            return;
        }
    }
    if(selectedIds.length < 5-maxElementsToSelect){ //max rezerwacji
        document.getElementById(id).style.backgroundColor = "#00B482";
        selectedIds.push(id);
    }
}
function prevPage(){
    prevMonth();
    clearModal();
    generateModal();
    document.getElementById("next").style.display = "block";
    document.getElementById("prev").style.display = "none";
}

function nextMonth (){
    globalDate = new Date(globalDate.setMonth(globalDate.getMonth()+1));
}

function prevMonth(){
     globalDate = new Date(globalDate.setMonth(globalDate.getMonth()-1));
     
}

function closeModal(){
    clearModal();
    document.getElementById("next").style.display = "block";
    document.getElementById("prev").style.display = "none";
    globalDate = new Date();
}

async function saveReservation (){
    let response = true;
    for(let i = 0; i < selectedIds.length;i++){
        await $.post(`${ip}/avaiableDesk`,{data: `${globalDate.getFullYear()}-${globalDate.getMonth()+1}-${selectedIds[i]}`, nr_biurka: deskId},async function(data, status){
            if(!data){
                response = !response;
            }
        });
    }
    if(response){
        for(let i = 0; i < selectedIds.length;i++){
            await $.post(`${ip}/addDesk`,{imie: firstname, nazwisko: lastname, data: `${globalDate.getFullYear()}-${globalDate.getMonth()+1}-${selectedIds[i]}`, nr_biurka: deskId},async function(data, status){
            });
        }
    }else{
        alert("Wyjebało się wszystko");
    }
    closeModal();
}

function clearModal(){
    for(let i = 0;i < 6;i++){
        document.getElementById(names[i]).innerHTML = "";
    }
    elements = []
    selectedIds = []
}
async function generateDaysElements(){
    let day = getNameOfFirstDay(globalDate);
    if(day == 0){
        day = 7;
    }
    let daysInMonth = getDaysInMonth(globalDate);
    let numberOfWeeks = getNumberOfWeeks(globalDate);
    for(let i = 0; i < (day-1); i++){
        elements.push(`<div class="col-md-1 day"></div>`);
    }
    for(let i = 1;i <= daysInMonth; i++){

        elements.push(`<div class="col-md-1 day" id="day-box-${i}" onmouseover="hoverdiv(event, this.id)" onmouseout="hoverdiv(event, this.id)"><button onclick="selectDay(this.id)" class="dayy" id="${i}">${i}</button></div>`);
    }
    let leftToAdd = (numberOfWeeks*7) - elements.length;
    for(let i = 0; i < leftToAdd; i++){
        elements.push(`<div class="col-md-1 day"></div>`);
    }
}

async function generateModal(idBiurka){
    if(idBiurka) deskId = idBiurka;
    document.getElementById('pierwszyModalLabel').innerHTML = `Biurko nr ${deskId}`;
    await $.get(`${ip}/userReservationsName/${firstname}/${lastname}`,async function(data, status){
        maxElementsToSelect = data.length;
    });
    getDataForPopUp(deskId,globalDate.getMonth()+1,globalDate.getFullYear());
    let dates = [];
    await $.get(`${ip}/reservedDesk/${deskId}`,async function(data, status){
        if(data.length > 0){
            for(let i = 0; i < data.length; i++){
                dates.push(data[i].data_rezerwacji.substring(0,10));
            }
        }

    });
    
    let numberOfWeeks = getNumberOfWeeks(globalDate);
    if(numberOfWeeks == 5){
        document.getElementById("six").style.display = "none";
    }else{
        document.getElementById("six").style.display = "flex";
    }
    await generateDaysElements();
    let nameOfMonth = getMonthName(globalDate);
    document.getElementById('actualMonth').innerHTML = nameOfMonth;
    for(let i = 0;i < numberOfWeeks;i++){
        let actuallDiv = document.getElementById(names[i]);
        for(let j = 0; j < 7;j++){
            if(j == 5 || j == 6){
                if(elements[0] != `<div class="col-md-1 day"></div>`){
                    let id;
                    id = elements[0].charAt(38) + elements[0].charAt(39);
                    if(isNaN(id)){
                        id = elements[0].charAt(38);
                    }
                    id = Number(id);
                    elements[0] = `<div class="col-md-1 day" style="background-color: #a6a6a6;">${id}</div>`
                }
            }
            actuallDiv.innerHTML += elements.shift();
        }
    }
    dates.forEach(e => {
        let year = e.substring(0,4)
        let month = e.substring(5,7)
        let day = e.substring(8,10)
        if(month.startsWith("0")){
            month = month.substring(1);
        }
        if(day.startsWith("0")){
            day = day.substring(1);
        }
        if( year == `${globalDate.getFullYear()}`){
            if(month == `${(globalDate.getMonth()+1)}`){
                document.getElementById(`day-box-${day}`).innerHTML = `${day}`;
                document.getElementById(`day-box-${day}`).style.backgroundColor = "#ff8080";
            }
        }
    });
    let tempDate = new Date().getMonth();
    if(tempDate == globalDate.getMonth()){
        for(let i = 1; i < globalDate.getDate(); i++){
            if(document.getElementById(`${i}`).classList[0] == "dayy"){
                document.getElementById(`${i}`).style.pointerEvents = "none"
            }
            if(document.getElementById(`day-box-${i}`)){
                document.getElementById(`day-box-${i}`).style.backgroundColor = "#bfbfbf"
                if(document.getElementById(`${i}`).classList[0] == "dayy"){
                    document.getElementById(`${i}`).style.backgroundColor = "#bfbfbf"
                    document.getElementById(`${i}`).style.width = "99%";
                } 
            }
        }
    } 
}



// NAZWA MIESIACA
function getMonthName (date){
     const month = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
     let dateNumber = month[date.getMonth()];
     let year = date.getFullYear();
     return `${dateNumber}, ${year}`;
}

function getNumberOfWeeks (date){
     let number = getNameOfFirstDay(date);
     let numbermtn = getDaysInMonth (date);
     if (((number == 6 || number == 0) && numbermtn == 31) || (number == 0 && numbermtn==30)){
          return 6;
     }else{
          return 5;
     }
}
