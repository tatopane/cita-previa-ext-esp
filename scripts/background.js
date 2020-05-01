function setData(data){
    chrome.storage.local.set(data, function(){
        if(!chrome.runtime.lastError){
        console.log('Saved: ', data);
        }   
    });
}

function toggle_extension(status, tab_id){
    chrome.browserAction.setIcon({ path: { "19": "images/delivery-"+status+"-19.png",
                                           "38": "images/delivery-"+status+"-38.png" }, tabId: tab_id});
    // Pass variable & execute script
    chrome.tabs.executeScript((tab_id,  { code: 'var extension_status = "'+status+'"' }));
    if (status == 'on') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tab_id, {message: "search_delivery"}, function(response) {
            console.log("message sent");
          });
        });
    }
}

function my_listener(tabId, changeInfo, tab) {
	chrome.storage.local.get(['toggle','status','the_tab_id'], function(result) {
        if (result){
            data = result;
            // If updated tab matches this one
            if (tabId == data.the_tab_id && changeInfo.status == "complete" && data.status == 'on') {
                toggle_extension(data.status, data.the_tab_id);
            }
        }
    });
    
}

var dataObj = {};
dataObj["toggle"] = false;
dataObj["status"] = "off";
dataObj["the_tab_id"] = "";
setData(dataObj);

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.local.get(['toggle','status','the_tab_id'], function(result) {
        if (result){
            data = result;
            console.log("Read:", data);
            data["toggle"] = !data["toggle"];
            data["status"] = 'off';
            data["the_tab_id"] = tab.id;
            if(data["toggle"]) { data["status"] = 'on';}
            setData(data);
            toggle_extension(data["status"], tab.id);
        }
    });
});

chrome.tabs.onUpdated.addListener(my_listener);