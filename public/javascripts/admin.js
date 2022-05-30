const ip = 'http://192.168.43.172:3000';

async function showName (iddesk){
     let isDisabled = await $.post(`${ip}/checkdesk`,{nr_biurka: iddesk},async function(data, status){
          return data;
     })
     if(isDisabled.is_disabled == 0){
          alert(`Zablokowano biurko ${iddesk}`)
          let element = document.getElementById(`${iddesk}`);
		element.classList.add("disable-admin")
          await $.post(`${ip}/ondesk`, {nr_biurka: iddesk} ,async function(data, status){
               return data;
          })
     }else{
        alert(`Odblokowano biurko ${iddesk}`)
        let element = document.getElementById(`${iddesk}`);
		element.classList.remove("disable-admin")
          await $.post(`${ip}/offdesk`,{nr_biurka: iddesk} ,async function(data, status){
               return data;
          })
     }
}
