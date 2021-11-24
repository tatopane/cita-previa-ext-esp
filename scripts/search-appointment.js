function send_mail() {
	var xmlHttp = new XMLHttpRequest();
	var formData = new FormData();
	var url = "https://api.mailgun.net/v3/" + mg_domain + "/messages";

	formData.append('user','api:' + mg_key);
	formData.append('to', mg_email_to);
	formData.append('from','Tato <Tato@' + mg_domain + '>');
	formData.append('subject','Prime now Slots available');
	formData.append('text', 'Testing some Mailgun awesomeness!');

	xmlHttp.onreadystatechange = function()
	{
	    if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
	    {
	        alert(xmlHttp.responseText);
	    }
	}
	var authorizationBasic = window.btoa('api:' + mg_key);
	xmlHttp.open("POST", url); 
	xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xmlHttp.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
	xmlHttp.send(formData); 

}

function send_push() {
	var xmlHttp = new XMLHttpRequest();
	var url = "https://api.pushbullet.com/v2/pushes";
	var data = JSON.stringify({"body":"Cita Extranjeria available","title":"Cita Extranjeria","type":"note"});

	xmlHttp.open("POST", url); 
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	xmlHttp.setRequestHeader('Access-Token', pb_token);
	xmlHttp.send(data); 
}

function found() {
	console.log("Appointment slots found");
	alert("Appointment slots found");
	if (pb_enabled) {
		send_push();
	}
	if (mg_enabled) {
		send_mail();
	}
}

function search() {
   console.log("searching");
   var name = "En este momento no hay citas disponibles";
   var pattern = name.toLowerCase();
   var targetId = "";
   
   var p = document.querySelector('.mf-msg__info');
   if (p) {
   		var index = p.innerText.toLowerCase().indexOf(pattern);	
   		if (index != -1) {
	         console.log("No appointments found, waiting for reload");
	         targetId = "xxxxxx";
	         setTimeout(() => { console.log("reloading"); document.getElementById("btnSalir").click(); }, 60000);
	    } else {
	    	found();
	    	setTimeout(() => { console.log("reloading"); document.getElementById("btnSalir").click(); }, 180000);
	    }
   } else {
   		found();
   		setTimeout(() => { console.log("reloading"); document.getElementById("btnSalir").click(); }, 180000);
   }
   
}

function fill_forms() {
	var location = window.location.href;
	console.log(location);
	var base_url = 'https://sede.administracionespublicas.gob.es/icpplustiem/';
	var entry_point = 'https://sede.administracionespublicas.gob.es/icpplus/index.html'
	var urls = ["citar?p=28&locale=es","acInfo","acEntrada", "acValidarEntrada", "acCitar"];
	var step = -1;

	for (var i = 0; i < urls.length; i++) { 
		var index = location.indexOf(urls[i]);
		if (index != -1) {
			console.log(urls[i], i);
			step = i;
			break;
		}
	}
	try {
		switch(step) {
		  case 0:
		  	setTimeout(() => {}, 3000);
		    var tramite = document.getElementById("tramiteGrupo[1]");
				tramite.value = tramite_id;
				var submitBtn = document.getElementById("btnAceptar");
				submitBtn.click();
		    break;
		  case 1:
		  	setTimeout(() => {}, 3000);
		    var submitBtn = document.getElementById("btnEntrar");
				submitBtn.click();
		    break;
		  case 2:
		  	setTimeout(() => {}, 3000);
		  	document.getElementById("txtIdCitado").value = nie;
		  	document.getElementById("txtDesCitado").value = full_name;
		  	if (tramite_id == 4032) {
		  		document.getElementById("txtAnnoCitado").value = year_of_birth;
		  		document.getElementById("txtPaisNac").value = country_born_id;	
		  	}
		    var submitBtn = document.getElementById("btnEnviar");
				submitBtn.click();
		    break;
		  case 3:
		  	setTimeout(() => {}, 3000);
		    var submitBtn = document.getElementById("btnEnviar");
				submitBtn.click();
		    break;
		  case 4:
		    search();
		    break;
		  default:
		  	window.location.href = entry_point;
		  	setTimeout(() => {}, 3000);
		  	document.getElementById("form").value = "/icpplustiem/citar?p=" + province_id + "&locale=es";
		  	document.getElementById("btnAceptar").click();
		    console.log("Default step executed. Back to entry point")
		}
	}
	catch(err){
		console.log(err);
		setTimeout(() => { fill_forms(); }, 5000);
		
	}
}


const settings_file = chrome.runtime.getURL('data/settings.json');

fetch(settings_file)
		    .then((response) => response.json()) //assuming file contains json
		    .then((json) => {
		    	mg_enabled = json["mailgun"].enabled;
				mg_domain = json["mailgun"].domain;
				mg_key = json["mailgun"].api_key;
				mg_email_to = json["mailgun"].email_to;
				pb_enabled = json["pushbullet"].enabled;
				pb_token = json["pushbullet"].access_token;
				province_id = json["PII"].province_id;
				tramite_id = parseInt(json["PII"].tramite_id);
				nie = json["PII"].nie;
				full_name = json["PII"].full_name;
				year_of_birth = json["PII"].year_of_birth.toString();
				country_born_id = parseInt(json["PII"].country_born_id);

		  });


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	//console.log("received", request.message);
    if( request.message == "search_appointment" ) {
      console.log("started"); // Add timestamp to this log
      fill_forms();
    } else {
    	console.log("no message");
    }
  }
);
