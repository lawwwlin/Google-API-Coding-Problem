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

// authorize access to drive and sheets
const drive = google.drive({version: 'v3', auth: oAuth2Client});
const sheets = google.sheets({version: 'v4', auth: oAuth2Client});

// call Google API
const run = async () => {
  
  // const sheetData = await getSheetData('1N0IHTEEB7jTqE8YaJeW1BKXC9FrRLJLDDIdWkZWvhb8');
  // console.log("sheetdata", sheetData);

  const fileDataMainfolder = await getFilesInFolder('10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH');
  console.log("fileDataMainfolder", fileDataMainfolder);
  fileDataMainfolder.map((file) => {
    const
  });
  

  // const newFolderId = await createFolder('10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH');
  // console.log('newFolderId', newFolderId);

};
run();





/**
 * get the product name and image file name in the spreadsheet:
 * @param {string} fileId id of the Google sheets.
 */
async function getSheetData(fileId) {
  try {
    const data = [];
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: fileId,
      range: 'Sheet1!A2:E',
    });
    return Promise.resolve(response.data.values);
  } catch (err) {
    console.log(err.message);
  };

}

/**
 * get all file content inside given folder id
 */
async function getFilesInFolder(fileId) {
  try {
    const response = await drive.files.list({
      q: `"${fileId}" in parents and not name contains '.ds_store'`,
      fields: 'nextPageToken, files(id, name, mimeType)',
    });
    return Promise.resolve(response.data.files);
  } catch (err) {
    console.log(err.message);
  }
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
    return Promise.resolve(response.data.id);
  } catch (err) {
    console.log(err.message);
  };
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