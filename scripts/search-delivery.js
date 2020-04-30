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
	var data = JSON.stringify({"body":"Delivery available","title":"Amazon Prime Now","type":"note"});

	xmlHttp.open("POST", url); 
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	xmlHttp.setRequestHeader('Access-Token', pb_token);
	xmlHttp.send(data); 
}

function search() {
   console.log("searching");
   var name = "No delivery windows available";
   var pattern = name.toLowerCase();
   var targetId = "";
   
   // FIXME: add try catch for the case of TypeError: Cannot read property 'getElementsByTagName' of null
   var div = document.getElementById("delivery-slot");
   var spans = div.getElementsByTagName("span");

   for (var i = 0; i < spans.length; i++) {
      var index = spans[i].innerText.toLowerCase().indexOf(pattern);
      if (index != -1) {
         console.log("No delivery slots found, waiting for reload");
         targetId = "xxxxxx";
         setTimeout(() => { console.log("reloading"); document.location.reload(); }, 60000);
         break;
      }
   }
   if (targetId.length == 0) {
   	  console.log("Delivery slots found");
   	  alert("Delivery slots found");
   	  if (pb_enabled) {
   	  	send_push();
   	  }
   	  if (mg_enabled) {
   	  	send_mail();
   	  }
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

    });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	//console.log("received", request.message);
    if( request.message == "search_delivery" ) {
      console.log("started"); // Add timestamp to this log
      search();
    } else {
    	console.log("no message");
    }
  }
);
