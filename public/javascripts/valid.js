function validateEmptyInput() {
     let x = document.forms["loginbtnform"]["firstname"].value;
     let y = document.forms["loginbtnform"]["lastname"].value;
     if ((x == "") || (y=="")){
          return false;
     }else {
          return true; 
     }
}

function validateNumber() {
     let x = document.forms["loginbtnform"]["firstname"].value;
     let y = document.forms["loginbtnform"]["lastname"].value;
     var re = /^[A-Za-z]+$/;
     if((re.test(x)) && (re.test(y)))
       return true;
     else
       return false;
 }

function validateForm(){    
     if((validateEmptyInput() == false) || (validateNumber() == false)){
          return false;
     }else{
          return true;
     }
     
}
