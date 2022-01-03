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
            text: 'done',
            visible: true
        });
    } catch(err) {
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



	
	fetch('https://mc-260crls51zy9yd64d27td22t8.rest.marketingcloudapis.com/hub/v1/dataeventsasync/key:AFE77857-1B91-49A9-96B6-C201929888D5/rowset', 
	{
	mode: "opaque",	  
	method: "POST",
      //headers: {"Content-type": "application/json; charset=UTF-8","Authorization": "Bearer " + $('#authTokens')}, 
	 //headers: {"Content-type": "application/json; 'Access-Control-Allow-Origin':'*';  'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS';charset=UTF-8","Authorization": "Bearer " + $('#authTokens')}, 
      headers: {"Content-type": "application/json; 'Access-Control-Allow-Origin':'*';  Access-Control-Allow-Credentials: true; 'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS';charset=UTF-8","Authorization": "Bearer" + $('#authTokens')}, 
      
       "Access-Control-Allow-Credentials": true,
		
		body: JSON.stringify(
   		{
        "keys": {
            "LoanIDs": "{{Contact.Attribute.SMS.loanId}}"
        },
        "values": {
            "Template_IDs": $('#TemplateIDValue'),
            "SMS_IDs": $('#SMSidValue')
        }
    })
		})
	.then(response => response.json()) 
    .then(json => {
     if(json.statusCode >= 300) { console.log("this is error")
     } else {
     console.log("this is success")
      }
     }).catch(err => console.log(err));
	debugger
	console.log("SMS ID: " +JSON.stringify(SMSidValue));
	console.log("Template ID: " +JSON.stringify(TemplateIDValue));
	console.log("Loan ID: " +JSON.stringify("{{Contact.Attribute.SMS.loanId}}"));
}

	//	fetch('https://demo-default.uw2.customer-messaging-gateway-nprd.lendingcloud.us/api/customer-messaging-gateway/v1/message', {
  	//	method: "POST",
  //		body: JSON.stringify(payload['arguments'].execute.inArguments),
  //		headers: {"Content-type": "application/json; charset=UTF-8"}
//		})
	//	.then(response => response.json()).catch(err => console.log(err)) 
   //     .then(json => console.log(json)).catch(err => console.log(err)); 

});