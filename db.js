const mysql = require('mysql2');
const cfg = require('./config.json')

const pool = mysql.createPool({
    host     : cfg.db_host,
    user     : cfg.db_user,
    password : cfg.db_password,
    database : cfg.db_database
});

const promisePool = pool.promise();

module.exports.getDisabledDesks = async () =>{
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`SELECT id_biurka FROM biurka WHERE is_disabled = 1`)
     con.release();
     return res;
}

module.exports.getReservationsByName = async (firstname, lastname) =>{
     firstname = firstname.toUpperCase()
     lastname = lastname.toUpperCase()
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`SELECT nr_biurka,data_rezerwacji FROM rezerwacje WHERE imie = "${firstname}" AND nazwisko = "${lastname}"`)
     con.release();
     return res;
}

module.exports.removeRecordByData = async (firstname, lastname, date, deskId) =>{
     firstname = firstname.toUpperCase()
     lastname = lastname.toUpperCase()
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`DELETE FROM rezerwacje WHERE imie = "${firstname}" AND nazwisko = "${lastname}" AND data_rezerwacji="${date}" AND nr_biurka=${deskId}`)
     con.release();
     return true;
}

module.exports.checkAdminLogin = async (login, pass) =>{
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`SELECT * FROM administrators WHERE user_login="${login}" AND user_password="${pass}"`)
     con.release();
     if(!res[0]) return false;
     return true;
}

module.exports.checkIsDisabled = async (iddesk) =>{
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`SELECT is_disabled FROM biurka WHERE id_biurka = ${iddesk}`)
     con.release();
     return res;
}

// zwraca daty dla których mamy rezerwacje na dane biurko
module.exports.getReservedDaysOfDesk = async (deskId) =>{
  const con = await promisePool.getConnection();
  const [res, fields] = await con.query(`SELECT data_rezerwacji FROM rezerwacje WHERE nr_biurka = ${deskId}`)
  con.release();
  return res;
}
module.exports.getReservedDaysOfDeskName = async (deskId) =>{
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`SELECT imie,nazwisko,data_rezerwacji FROM rezerwacje WHERE nr_biurka = ${deskId}`)
     con.release();
     return res;
}

//zbierz stare rekordy
module.exports.removeOldRecords = async ()=>{
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`DELETE FROM rezerwacje WHERE data_rezerwacji < CURDATE()`)
     con.release();
     return res;
}

// Zwraca liczbę rezerwacji na dane imie i nazwisko
module.exports.getNumberOfUserReservations = async (firstname, lastname) =>{
  firstname = firstname.toUpperCase()
  lastname = lastname.toUpperCase()
  const con = await promisePool.getConnection();
  const [res, fields] = await con.query(`SELECT COUNT(*) AS number FROM rezerwacje WHERE imie = "${firstname}" AND nazwisko = "${lastname}"`)
  con.release();
  return res;
}

//dla danego miesiaca roku i numeru biurka zwraca imienia i nazwiska i dni
module.exports.getUsersReservationsForSpecificDate = async (deskId, month, year) =>{
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`SELECT imie,nazwisko,EXTRACT(DAY FROM data_rezerwacji) AS 'day' FROM rezerwacje WHERE nr_biurka=${deskId} AND MONTH(data_rezerwacji) = ${month} AND YEAR(data_rezerwacji) = ${year}`)
     con.release();
     return res;
   }
// ON BIURKA
module.exports.setDisableDesk = async (id_desk) =>{
     let biurko = id_desk;
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`UPDATE biurka SET is_disabled = 1 WHERE id_biurka = ${biurko}`)
     con.release();
     return res;
}

// OFF BIURKA
module.exports.setAvailableDesk = async (id_desk) =>{
     let biurko = id_desk;
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`UPDATE biurka SET is_disabled = 0 WHERE id_biurka = ${biurko}`)
     con.release();
     return res;
}

//Pobranie dat dla danego biurka razem z imionami i nazwiskami

// DODANIE REZERWACJI
module.exports.addReservationDesk = async (firstname, lastname, date, id_desk) =>{
     firstname = firstname.toUpperCase()
     lastname = lastname.toUpperCase()
     const con = await promisePool.getConnection();
     var response;
     try{
          response = await con.query(`INSERT INTO rezerwacje (imie,nazwisko,nr_biurka,data_rezerwacji) VALUES ("${firstname}", "${lastname}", ${id_desk}, "${date}")`)
     }catch{
          return "err";
     }
     con.release();
     const [res, fields] = response;
     return res;
}

// USUWANIE REZERWACJI PO DACIE
module.exports.removeReservationDeskByDate = async (date) =>{
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`DELETE * FROM rezerwacje WHERE data_rezerwacji = "${date}`)
     con.release();
     return res;
}


module.exports.checkAvailableDesk = async (date, id_desk) =>{
     const con = await promisePool.getConnection();
     var response;
     try{
          response = await con.query(`SELECT * FROM rezerwacje WHERE data_rezerwacji = "${date}" AND nr_biurka = ${id_desk}`)
     }catch{
          return "err";
     }
     const [res, fields] = response;
     con.release();
     if(res[0] == undefined){
          return false;
     }else{
          return true;
     }
}



module.exports.getAllUsers = async () =>{
    const con = await promisePool.getConnection();
    const [res, fields] = await con.query(`SELECT DISTINCT imie,nazwisko FROM rezerwacje`)
    con.release();
    return res;
}

module.exports.getAllDesks = async () =>{
     const con = await promisePool.getConnection();
     const [res, fields] = await con.query(`SELECT DISTINCT nr_biurka FROM rezerwacje`)
     con.release();
     return res;
 }
