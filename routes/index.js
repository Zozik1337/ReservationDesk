var express = require('express');
var router = express.Router();
const db = require('../db.js')
const SHA256 = require("crypto-js/sha256");

function hasNumber(myString) {
  return /\d/.test(myString);
}
function containsSpecialChars(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

router.get('/', async function(req, res, next) { // brak walidacji
  if(req.cookies.firstname && req.cookies.lastname){
    let deskData = await db.getDisabledDesks();
    let arrDesk = []
    for(let i = 0; i < deskData.length;i++){
      arrDesk.push(deskData[i].id_biurka);
    }
    return res.render('panel',{firstname: req.cookies.firstname, lastname: req.cookies.lastname,disabledDesks: JSON.stringify(arrDesk)});
  }
  return res.render('login');
});

router.get('/reservedDesk/:deskId', async function(req, res, next) { // walidacja zrobiona
  if(isNaN(req.params.deskId)) return res.send("error");
  let dbData = await db.getReservedDaysOfDesk(req.params.deskId);
  res.send(dbData);
});

router.get('/reservedDeskNames/:deskId', async function(req, res, next) { // walidacja zrobiona
  if(isNaN(req.params.deskId)) return res.send("error");
  let dbData = await db.getReservedDaysOfDeskName(req.params.deskId);
  res.send(dbData);
});

router.get('/getUsersReservations/:deskId/:month/:year', async function(req, res, next) { // walidacja zrobiona
  if(isNaN(req.params.deskId)) return res.send("error");
  let dbData = await db.getUsersReservationsForSpecificDate(req.params.deskId,req.params.month,req.params.year);
  res.send(dbData);
});

router.post('/', async function(req, res, next) { //brak walidacji
  let deskData = await db.getDisabledDesks();
  let arrDesk = []
  for(let i = 0; i < deskData.length;i++){
    arrDesk.push(deskData[i].id_biurka);
  }
  res.cookie("firstname",`${req.body.firstname}`).cookie("lastname",`${req.body.lastname}`).render('panel',{firstname: req.body.firstname, lastname: req.body.lastname,disabledDesks: JSON.stringify(arrDesk)});
});

router.get('/userReservationsName/:firstname/:lastname', async function(req, res, next) { //brak walidacji
  let reservationsData = await db.getReservationsByName(req.params.firstname, req.params.lastname);
  res.send(reservationsData);
});

router.post('/admin', async function(req, res, next) { //brak walidacji
  let loginRes = await db.checkAdminLogin(req.body.username, SHA256(req.body.password).toString());
  if(!loginRes) return res.send(`<script>window.location.href = "/admin"; alert("Bledne dane");</script>`);
  let data = await db.getDisabledDesks();
  let arr = []
  for(let i = 0; i < data.length;i++){
    arr.push(data[i].id_biurka);
  }
  res.render('admin-panel',{disabledDesks: JSON.stringify(arr)});
});

router.post('/removeUserReservation', async function(req, res, next) { //brak walidacji
  let resp = await db.removeRecordByData(req.body.firstname, req.body.lastname, req.body.date, req.body.deskId);
  res.send(resp);
});

router.post('/adminpanel', async function(req,res, next){
  res.render('admin-panel-reserv');
});
router.post('/adminreserv', async function(req,res, next){
  let data = await db.getDisabledDesks();
  let arr = []
  for(let i = 0; i < data.length;i++){
    arr.push(data[i].id_biurka);
  }
  res.render('admin-panel',{disabledDesks: JSON.stringify(arr)});
});


// function validate(data, validation)
// {
//      validation.forEach((k, v) => {
//           if(data[k] == undefined || !data[k]) {
//                return 0;
//           }

//           if(v == int) {
                    
//           }
//      });
// }


router.post('/addDesk', async function(req, res, next) {
  if(!req.body.imie || !req.body.nazwisko || !req.body.data || !req.body.nr_biurka || containsSpecialChars(req.body.imie) || containsSpecialChars(req.body.nazwisko)) return res.send("error");
  if(hasNumber(req.body.imie) || hasNumber(req.body.nazwisko)) return res.send("error");
  if(isNaN(req.body.nr_biurka)) return res.send("error");
  if(req.body.nr_biurka > 52) return res.send("error");
  let avaiableDesk = await db.checkAvailableDesk(req.body.data, req.body.nr_biurka);
  if(avaiableDesk || avaiableDesk == "err") return res.send("error")
  db.addReservationDesk(req.body.imie, req.body.nazwisko, req.body.data, req.body.nr_biurka)
  res.send("Udane")
});


router.post('/avaiableDesk', async function(req, res, next) {
    if(!req.body.data || !req.body.nr_biurka) return res.send("error");
    if(isNaN(req.body.nr_biurka)) return res.send("error");
    if(req.body.nr_biurka > 52) return res.send("error");
    let avaiableDesk = await db.checkAvailableDesk(req.body.data, req.body.nr_biurka);
    if(avaiableDesk == "err") return res.send("error")
    res.send(!avaiableDesk);
     

});


router.get('/admin', function(req, res, next) {
     res.render('admin');
});

// dodac walidacje
router.post('/offdesk', async function(req, res, next) {
     if((!req.body.nr_biurka) || isNaN(req.body.nr_biurka)) return res.send("error");
     db.setAvailableDesk(req.body.nr_biurka);
     res.send("udane")
});

// dodac walidacje
router.post('/ondesk', async function(req, res, next) {
     if((!req.body.nr_biurka) || isNaN(req.body.nr_biurka)) return res.send("error");
     db.setDisableDesk(req.body.nr_biurka);
     res.send("udane")
});

// dodac walidacje
router.post('/checkdesk', async function(req, res, next) {
     if((!req.body.nr_biurka) || isNaN(req.body.nr_biurka)) return res.send("error");
     let test = await db.checkIsDisabled(req.body.nr_biurka)
     res.send(test[0])
});


router.get('/getusers', async function(req, res, next) {
    let test = await db.getAllUsers();
    res.send(test);
});

router.get('/getalldesks', async function(req, res, next) {
  let test = await db.getAllDesks();
  res.send(test);
});


module.exports = router;
