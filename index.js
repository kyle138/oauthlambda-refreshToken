'use strict';

var google = require("googleapis");
var OAuth2 = google.auth.OAuth2;

/*
exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event,null,2)); //DEBUG
  if(!event.refresh) {
    callback("Required field missing: refresh");
  }
*/

  var oauth2Client = new OAuth2(
    'clientId',
    'clientSecret',
    'redirectURL'
  );

  oauth2Client.setCredentials({
    access_token: event.accessToken,
    refresh_token: event.refreshToken
  });

  oauth2Client.refreshAccessToken(function(err, tokens) {
    if(err) {
      console.log("refreshAccessToken error: "+err);
    } else {
      console.log("tokens: "+JSON.stringify(tokens,null,2));  //DEBUG
      console.log((new Date()).getTime() + (10 * 1000 * 60 * 60));
    }
  });
//} // End exports.handler
