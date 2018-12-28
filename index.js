'use strict';

const {google} = require('googleapis');
//var OAuth2 = google.auth.OAuth2;

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event,null,2)); //DEBUG
  // Check if required fields were populated
  if(!event.refreshToken || !event.accessToken) {
    callback("Required field missing", null);
  } else {
    // Check if required Lambda environment variables are set
    if( process.env.clientId &&
        process.env.clientSecret &&
        process.env.redirectUrl1 &&
        process.env.redirectUrl2)
    {
      // Check if origin is included as one of the redirectUrls
      var redirectUrl = (process.env.redirectUrl1.indexOf(event.origin) != -1)
        ? process.env.redirectUrl1
        : (process.env.redirectUrl2.indexOf(event.origin) != -1)
          ? process.env.redirectUrl2
          : null;

      if(redirectUrl) {
        // Initialize oauth2Client
        var oauth2Client = new google.auth.OAuth2(
          process.env.clientId, // Client ID
          process.env.clientSecret, // Client Secret
          redirectUrl // Redirect URL decided above
        );

        // Set access and refresh tokens in credentials
        oauth2Client.setCredentials({
          //access_token: event.accessToken,
          refresh_token: event.refreshToken
        });

        // DEBUG: trying to determine expiry time
        async function token411() {
          var tokenInfo = await oauth2Client.getTokenInfo(event.accessToken);
          console.log("tokenInfo:", JSON.stringify(tokenInfo,null,2));  //// DEBUG:
        }


        // Request refreshed tokens from Google
//        oauth2Client.refreshAccessToken(function(err, tokens) {
        oauth2Client.getAccessToken(function(err, tokens, res) {
          if(err) {
            console.log("refreshAccessToken error: "+err);
            token411();
            callback("refreshAccessToken error", null);
          } else {
            console.log("tokens: "+JSON.stringify(tokens,null,2));  //DEBUG
            console.log("results: "+JSON.stringify(res,null,2));  // DEBUG: 
            token411();
            callback(null, tokens);
          }
        });


      } else {  // if(redirectUrl)
        console.error("Origin: "+event.origin+" is not permitted.");
        callback("Invalid Origin", null); // Login only allowed from approved origins
      }
    } else {  // if(required environment variables)
      console.error("Missing required environment variable(s)");
      callback("Internal error",null);
    }
  } // if(required fields)

} // End exports.handler
