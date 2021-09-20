const {google} = require('googleapis');

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

/**
 * Get all file content inside given folder id
 * @param {String} fileId Id of the Google File
 * @return {[Object]} Array of files inside folder
 */
 async function getFilesInFolder(fileId) {
  try {
    const response = await drive.files.list({
      q: `"${fileId}" in parents and not name contains '.ds_store'`,
      fields: 'nextPageToken, files(id, name)',
    });
    return Promise.resolve(response.data.files);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get the product name and image file name in the spreadsheet:
 * @param {String} fileId Id of the Google Sheets
 * @return {[Object]} Array of data inside Sheets
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
    console.log(err);
  };
};

/**
 * Create a new folder inside the parent and return the folder Id
 * @param {String} parentFolderId Id of the parent folder
 * @return {String} New folder's id
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
    console.log(err);
  };
};

/**
 * Copy and rename the file to the specified folder
 * @param {Object} file File object to be copied
 * @param {String} destinationId Id of the destination folder
 * @return {[Object]} Array of files that got copied with updated name
 */
async function copyFileTo(file, destinationId) {
  const fileName = unifyName(file.name);
  const resource = {
    'name': fileName,
    'parents': [destinationId]
  }
  try {
    const response = await drive.files.copy({
      'fileId': file.id,
      resource
    });
    return Promise.resolve(response.data);
  } catch (err) {
    console.log(err);
  };
};

/**
 * Given a string file name with extension (dog.jpg):
 * 1. change the name to lowercase, keep file extension
 * 2. remove none letter and none number characters
 * 3. replace space with '-'
 * @param {String} string The string to modify
 * @return {String} The modiefied string
 */
 function unifyName(string) {
  const lowered = string.toLowerCase();
  const strArr = lowered.split('.');
  const fileExtension = strArr[1];
  const characters = strArr[0];
  // replace all none-alphanumeric characters with space and split into array
  const arr = characters.trim().replace(/[^0-9a-z]/gi, ' ').trim().split(' ');
  const unified = arr.join('-');
  return unified + '.' + fileExtension;
};

/**
 * Match given file name to given sheet name
 * @param {String} fileName The file name to check
 * @param {String} sheetName The sheet name to check
 * @return {Boolean} True if all words in sheetName is in the file name, else false
 */
function matchFileWithSheet(fileName, sheetName) {
  const words = sheetName.split(' ');
  for (const word of words) {
    if (!fileName.includes(word.toLowerCase())) {
      return false;
    }
  }
  return true;
};

/**
 * Write data to specified Google Sheets
 * @param {String} sheetId The Google Sheet to write to
 * @param {String} cell The cell to input
 * @param {String} value The data to put into the cell
 */
 async function writeToSheet(sheetId, cell, value) {
  const values = [[value]];
  const resource = {
    values
  };
  try {
    sheets.spreadsheets.values.update({
      resource,
      spreadsheetId: sheetId,
      valueInputOption: 'RAW',
      range: cell
    });
  } catch (err) {
    console.log(err);
  };
};

module.exports = {getFilesInFolder, getSheetData, createFolder, copyFileTo, matchFileWithSheet, writeToSheet};