const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// set-up the following credentials, follow https://developers.google.com/identity/protocols/oauth2
const CLIENT_ID = '579158930170-7lq9kp2brl2t6jhq6c0aiga6scl54bu9.apps.googleusercontent.com';
const CLIENT_SECRET = '-Hoid0h89nVL8-MRe2_Gg5wW';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04nKLP6KoN3JwCgYIARAAGAQSNwF-L9IrzBEMjmwKUdFMt4oAmjeyy6HyuAZk7SNrjdguKjSV62kI_fjzD9DxUIW77eVDMYmAzCM';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({version: 'v3', auth: oAuth2Client});

const sheets = google.sheets({version: 'v4', auth: oAuth2Client});

// call Google API
// const sheetData = getSheetData('1N0IHTEEB7jTqE8YaJeW1BKXC9FrRLJLDDIdWkZWvhb8');
// const fileDataMainfolder = getFilesInFolder('10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH');
const newFolderId = createFolder('10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH');
console.log('newFolderId', newFolderId);


let photoData = [];


// console.log("sheetdata", sheetData);
// console.log('filedata', fileDataMainfolder);

// fileDataMainfolder.map((file) => {
//   const photos = getFilesAndCopy(auth, file.id, '10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH');
//   setTimeout(() => {
//     // console.log('photos', photos)
//     photoData = photoData.concat(photos);
//   }, 300);
// });

// setTimeout(() => {
//   console.log('photoData', photoData);
//   console.log(photoData.length);
// }, 300);


/**
 * get the product name and image file name in the spreadsheet:
 * @param {string} fileId id of the Google sheets.
 */
function getSheetData(fileId) {
  const data = [];
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
 */
function getFilesInFolder(fileId) {
  const data = [];
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
 * create new folder and return the folder Id
 */
 async function createFolder(parentFolderId) {
  try {
    const fileMetadata = {
      'name': 'all-dog-images-Lawrence',
      'mimeType': 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    });

    console.log(response);

  } catch (err) {
    console.log(err.message);
  }
}

/**
 * get all file content inside given folder id
 */
 function getFilesAndCopy(fileId, destinationId) {
  const data = [];
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