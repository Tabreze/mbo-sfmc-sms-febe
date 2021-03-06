define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
	//var contacts = {};
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
    {"key": "step1", "label": "MBO Gayeway Template and SMS ID Selection	"}
    ];
    var currentStep = steps[0].key;
	var authTokens = {};
    $(window).ready(onRender);
    
    try {
    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', save);
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);
    } catch(err) {
        console.log(err);
    }

    function onRender() {
	//debugger
        try {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        } catch(err) {
            throw(err);
            //console.log(err);
        }
    }

  function initialize(data) {
	//debugger
        //console.log("***Initialize  " + data);
        if (data) {
            payload = data;
        }    

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

         console.log('Has In arguments: '+JSON.stringify(inArguments));
        try {
         $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'SMSid_Value') {
                    $('#SMSid').val(val);
                }

                if (key === 'TemplateID_Value') {
                    $('#TemplateID').val(val);
                }

               })
        });

   
        connection.trigger('updateButton', {
            button: 'next',
            text: 'Done',
            visible: true
       
    });
}   catch(err) {
         throw(err);
       // console.log(err);
    }
}
   

    function onGetTokens (tokens) {
	//debugger
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
        //console.log(tokens);
        authTokens = tokens;

    }
    

    function onGetEndpoints (endpoints) {
	//debugger
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
        //console.log(endpoints);
    }

    function save() {
	debugger
        try {
		//alert($('#SMSid').val());
		//console.log("***Calling save function: ");
		var SMSidValue = $('#SMSid').val();
        var TemplateIDValue = $('#TemplateID').val();


         if( SMSidValue === "" || TemplateIDValue === ""){
			//functionAlert()
			//Swal.fire("Select IDs from the Dropdown");
			//swal("Alert!", "Select IDs from the Dropdown");
			//alert("Select IDs from the Dropdown");
			//var element = document.createElement("div");
    		//	element.appendChild(document.createTextNode('Select IDs from the Dropdown'));
    		//	document.getElementById('step1').appendChild(element);
				//alert("Select IDs from the Dropdown");
				
            //throw "exit"
			//sleep(1);
			
			document.getElementById("step2").innerHTML = "Select ID from the Dropdown!";
			return;
            }
            		
			
	    //payload['metaData'].isConfigured = true;
		//payload.name = name;
        payload['arguments'].execute.inArguments = [{
            "SMSid_Value": SMSidValue,
            "TemplateID_Value": TemplateIDValue,
			 //"tokens": authTokens,
			"loanId": "{{Contact.Attribute.SMS.loanId}}",
			"eventType": "{{Contact.Attribute.SMS.eventType}}",
			"communicationChannel": "{{Contact.Attribute.SMS.communicationChannel}}",
			"primaryActorId": "{{Contact.Attribute.SMS.primaryActorId}}",
			"businessUnit": "{{Contact.Attribute.SMS.businessUnit}}",
			"scheduleDate": "{{Contact.Attribute.SMS.scheduleDate}}",
			"vendor": "{{Contact.Attribute.SMS.vendor}}",
            "Contact": "{{Contact.Attribute.SMS.Contact}}" //<----This should map to your data extension name and phone number column
			
		
        }];
		//console.log("Contact number from DE: "+JSON.stringify("{{Contact.Attribute.SMS.Contact}}"));
				
        payload['metaData'].isConfigured = true;

        console.log("***Payload on SAVE function: " +JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
        //return 'Success';
        } catch(err) {
            documnet.getElement("error").style.display = "block";
            documnet.getElement("error").innerHtml = err;
        }


	/*fetch('https://mc-260crls51zy9yd64d27td22t8.auth.marketingcloudapis.com/v2/token', 
	{
		  
	 method: "POST",
    // headers: {"Content-Type": "application/json; charset=utf8","Access-Control-Allow-Origin": "https://mc.s8.exacttarget.com","Access-Control-Allow-Credentials": "true"},   
	headers: { 'Content-type': 'application/json'},
	mode: 'no-cors',
		
       body: JSON.stringify(
   		{
    "grant_type": "client_credentials",
    "client_id": "ca1xp4ph65dl9nxfgcbnjelk",
    "client_secret": "5B4zhj2pTWzvjAEqImLPrttU",
    "account_id": "517005233"
	})
    
		}) 
	.then(response => response.json()) 
    .then(json => {
     if(json.statusCode >= 300) { console.log("this is error")
     } else {
     console.log("this is success")
      }
    
     }).catch(err => console.log(err));
    
	
	fetch('https://mc-260crls51zy9yd64d27td22t8.rest.marketingcloudapis.com/hub/v1/dataeventsasync/key:AFE77857-1B91-49A9-96B6-C201929888D5/rowset', 
	{
	  
	 method: "POST",
    //headers: {"Content-type": "application/json, charset=UTF-8",'Authorization': "token", 'Access-Control-Allow-Origin': '*',"Access-Control-Allow-Credentials": "true"},   
	headers: { "Content-Type": "text/html",'Authorization': "token","Access-Control-Allow-Origin": '*' },	
	mode: 'no-cors',
		
       body: JSON.stringify(
   		{
        "keys": {
            "LoanIDs": "{{Contact.Attribute.SMS.loanId}}"
        },
        "values": {
            "Template_IDs": TemplateIDValue,
            "SMS_IDs": SMSidValue
        }
    })
		}) 
	.then(response => response.json()) 
    .then(json => {
     if(json.statusCode >= 300) { console.log("this is error")
     } else {
     console.log("this is success")
      }
    
     }).catch(err => console.log(err));*/
    
	console.log("SMS ID: " +JSON.stringify(SMSidValue));
	console.log("Template ID: " +JSON.stringify(TemplateIDValue));
	console.log("Loan ID: " +JSON.stringify("{{Contact.Attribute.SMS.loanId}}"));}


	//	fetch('https://demo-default.uw2.customer-messaging-gateway-nprd.lendingcloud.us/api/customer-messaging-gateway/v1/message', {
  	//	method: "POST",
  //		body: JSON.stringify(payload['arguments'].execute.inArguments),
  //		headers: {"Content-type": "application/json; charset=UTF-8"}
//		})
	//	.then(response => response.json()).catch(err => console.log(err)) 
   //     .then(json => console.log(json)).catch(err => console.log(err)); 

});