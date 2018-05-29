'use strict';
console.log('Loading function');
const AWS = require('aws-sdk')
AWS.config.region = 'us-east-1';
const sesClient = new AWS.SES();
const sesConfirmedAddress = "contact@wilfredmorgan.com";


// /**
//  * Lambda to process HTTP POST for contact form with the following body
//  * {
//       "email": <contact-email>,
//       "subject": <contact-subject>,
//       "message": <contact-message>
//     }
//  *
//  */

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var emailObj = event;
    var params = getEmailMessage(emailObj);
    var sendEmailPromise = sesClient.sendEmail(params).promise();
    
    var response = {
        statusCode: 200
    };
    
    sendEmailPromise.then(function(result) {
        console.log(result);
        callback(null, response);
    }).catch(function(err) {
        console.log(err);
        response.statusCode = 500;
        callback(null, response);
    });
};

function getEmailMessage (emailObj) {
    var emailRequestParams = {
        Destination: {
          ToAddresses: [ sesConfirmedAddress ]  
        },
        Message: {
            Body: {
              
                Text: {
                    Data: 
                    "Name: " + emailObj.name + "\n" +
                    "Company: " + emailObj.company + "\n" +
                    "Phone: " + emailObj.phone + "\n" +
                    "Message: " + emailObj.message
          
                },
            },
            Subject: {
                Data: emailObj.subject
            }
        },
        Source: sesConfirmedAddress,
        ReplyToAddresses: [ emailObj.email ]
    };
    
    return emailRequestParams;
}
