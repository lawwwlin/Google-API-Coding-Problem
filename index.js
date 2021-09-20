const {google} = require('googleapis');

// Google Sheet id of dogs breed list
const SHEET_ID = '1N0IHTEEB7jTqE8YaJeW1BKXC9FrRLJLDDIdWkZWvhb8';
// Google Drive id of the main drive containing sub-folders of dog photos
const DRIVE_ID = '10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH';

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
  
  // const sheetDataArray = await getSheetData(SHEET_ID);
  // console.log("sheetDataArray", sheetDataArray);

  const fileDataArray = await getFilesInFolder(DRIVE_ID);
  // console.log("fileDataArray", fileDataArray);
  
  // go through each subfolder and return the array of photos
  const photosNestedArray = await Promise.all(fileDataArray.map(async (file) => {
    const photo = await getFilesInFolder(file.id);
    return photo;
  }));

  // flatten the nested arrays to be just array with objects
  const photosArray = [].concat.apply([], photosNestedArray);
  console.log("photosdata", photosArray);

  // const newFolderId = await createFolder(DRIVE_ID);
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