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
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
        //console.log(tokens);
        authTokens = tokens;

    }
    

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
        //console.log(endpoints);
    }

    function save() {
	debugger
        try {
		//alert($('#SMSid').val());
		console.log("***Calling save function: ");
        var SMSidValue = $('#SMSid').val();
        var TemplateIDValue = $('#TemplateID').val();
        //payload['metaData'].isConfigured = true;
		payload.name = name;
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
            "to": "{{Contact.Attribute.SMS.Contact}}" //<----This should map to your data extension name and phone number column
			
		
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


	//	fetch('https://demo-default.uw2.customer-messaging-gateway-nprd.lendingcloud.us/api/customer-messaging-gateway/v1/message', {
  	//	method: "POST",
  //		body: JSON.stringify(payload['arguments'].execute.inArguments),
  //		headers: {"Content-type": "application/json; charset=UTF-8"}
//		})
	//	.then(response => response.json()).catch(err => console.log(err)) 
   //     .then(json => console.log(json)).catch(err => console.log(err)); 

	
	fetch('https://https://mc-260crls51zy9yd64d27td22t8.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:AFE77857-1B91-49A9-96B6-C201929888D5/rows', {
	method: "POST",
	headers: {"Content-type": "application/json; charset=UTF-8","Authorization": "Bearer " + $('#authTokens')}, 
		body: JSON.stringify(
   		{"items": [{
      	"SMS_IDs":$('#SMSidValue'),
      	"Template_IDs" : $('#TemplateIDValue'),
      	"LoanIDs": $('#loanId')
				 }]
		
		})
		})
	.then(response => response.json()).catch(err => console.log(err)) 
    .then(json => console.log(json)).catch(err => console.log(err)); 
}
//console.log("Template ID: " +JSON.stringify(SMS_IDs));
//console.log("Template ID: " +JSON.stringify(Template_IDs));
//console.log("Template ID: " +JSON.stringify(LoanIDs));

});