
var toggle = false;
var status = 'off';
var the_tab_id = '';

function set_status() { // FIXME: use chrome storage for property: https://stackoverflow.com/questions/32684346/chrome-extension-not-saving-data
    toggle = !toggle;
    status = 'off';
    if(toggle) { status = 'on';}
}

function toggle_extension(the_tabid){
    
    // console.log(the_tabid, "inside", status);
    // Set icon
    chrome.browserAction.setIcon({ path: { "19": "images/delivery-"+status+"-19.png",
                                       "38": "images/delivery-"+status+"-38.png" }, tabId: the_tabid});
    // Pass variable & execute script
    chrome.tabs.executeScript((the_tabid,  { code: 'var extension_status = "'+status+'"' }));
    console.log("status "+status);
    if (status == 'on') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(the_tabid, {message: "search_delivery"}, function(response) {
		    console.log("message sent");
		  });
		});
    }
    
}

function my_listener(tabId, changeInfo, tab) {
	// console.log(tabId, tabId==the_tab_id);
	// console.log(changeInfo, changeInfo.status=="complete", status);
	console.log("status in listener "+status);
    // If updated tab matches this one
    if (tabId == the_tab_id && changeInfo.status == "complete" && status == 'on') {
        toggle_extension(the_tab_id);
    }
}

chrome.browserAction.onClicked.addListener(function(tab) {
    set_status();
    // Set the tab id
    the_tab_id = tab.id;
    toggle_extension(the_tab_id);
});

chrome.tabs.onUpdated.addListener(my_listener);