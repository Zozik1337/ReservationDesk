let globalData = [];
async function getDataForPopUp(deskId,month,year){
    await $.get(`${ip}/getUsersReservations/${deskId}/${month}/${year}`,async function(data, status){
        globalData = data;
    });
    document.getElementById("whoreserved").innerHTML = ""
}

async function hoverdiv(e, id){
    let numberOfDay = document.getElementById(id).textContent;
    for(let i = 0;i < globalData.length;i++){
        if(globalData[i].day == numberOfDay){
            document.getElementById("whoreserved").innerHTML = `${globalData[i].imie} ${globalData[i].nazwisko}`
            break;
        }else{
            document.getElementById("whoreserved").innerHTML = ""
        }
    }
    $("#whoreserved").toggle();
    return false;
}