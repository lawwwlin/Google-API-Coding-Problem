const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.


fs.readFile('credentials.json', async (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials
  const auth = authorize(JSON.parse(content));
  
  // call Google API with authorized credentials
  const sheetData = getSheetData(auth, '1hnQP8tYU9PAv6eVknGsMld6yWZ6cmbVpuc6b-_085nQ');
  const fileDataMainfolder = getFilesInFolder(auth, '11PJEUZl8QmZlNSl23_AfF3cjxKa-wgJH');
  let photoData = [];
  
  // wait 0.6 seconds until data is set.
  setTimeout(() => {
    // console.log("sheetdata", sheetData);
    // console.log('filedata', fileDataMainfolder);
    fileDataMainfolder.map((file) => {
      const photos = getFilesAndCopy(auth, file.id, '10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH');
      setTimeout(() => {
        // console.log('photos', photos)
        photoData = photoData.concat(photos);
      }, 300);
    });

    setTimeout(() => {
      console.log('photoData', photoData);
      console.log(photoData.length);
    }, 300);
    
  }, 600);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  try {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  }
  catch (err) {
    if (err) return getNewToken(oAuth2Client);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      return oAuth2Client;
    });
  });
  return oAuth2Client;
}

/**
 * get the product name and image file name in the spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 * @param {string} fileId id of the Google sheets.
 */
function getSheetData(auth, fileId) {
  const data = [];
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: fileId,
    range: 'Sheet1!A2:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      // get columns A and B, which correspond to indices 0 and 1.
      rows.map((row) => {
        obj = {}
        obj[row[0]] = row[1];
        data.push(obj);
      });
      // console.log('data', data);
    } else {
      console.log('No data found.');
    }
  });
  return data;
}

/**
 * get all file content inside given folder id
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getFilesInFolder(auth, fileId) {
  const data = [];
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    q: `"${fileId}" in parents and not name contains '.ds_store'`,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      files.map((file) => {
        data.push(file);
      });
    } else {
      console.log('No files found.');
    }
  });
  return data;
}

/**
 * get all file content inside given folder id
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
 function getFilesAndCopy(auth, fileId, destinationId) {
  const data = [];
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    q: `"${fileId}" in parents and not name contains '.ds_store'`,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      files.map((file) => {
        data.push(file);
        drive.files.copy({
          "fileId": file.id,
          "resource": {
            "driveId": destinationId
          }
        })
        .then(function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
        },
        function(err) { console.error("Execute error", err); });
      });
    } else {
      console.log('No files found.');
    }
  });
  return data;
}