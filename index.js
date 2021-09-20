// Google Sheet id of dogs breed list
const SHEET_ID = '1N0IHTEEB7jTqE8YaJeW1BKXC9FrRLJLDDIdWkZWvhb8';

// Google Drive id of the main drive containing sub-folders of dog photos
const DRIVE_ID = '10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH';

const { getFilesInFolder, getSheetData, createFolder, copyFileTo, matchFileWithSheet, writeToSheet } = require('./helpers');

// run calls to Google API
const run = async () => {
  // get content from main drive
  const fileDataArray = await getFilesInFolder(DRIVE_ID);
  
  // go through each subfolder and return the array of photos
  // the returned array is nested: [[], [], []]
  const photosNestedArray = await Promise.all(fileDataArray.map(async (file) => {
    const photo = await getFilesInFolder(file.id);
    return photo;
  }));
  
  // flatten the nested arrays to be just array with objects
  const photosArray = [].concat.apply([], photosNestedArray);
  
  // create new folder in main drive to store copies of files
  const newFolderId = await createFolder(DRIVE_ID);
  
  // copy renamed files to new folder
  const copiedNestedPhotosArray = await Promise.all(photosArray.map(async (file) => {
    const photo = await copyFileTo(file, newFolderId);
    return photo;
  }));

  // array of copied files with file ids, updated names
  const copiedPhotosArray = [].concat.apply([], copiedNestedPhotosArray);
  
  // get breed names from sheets
  const sheetDataArray = await getSheetData(SHEET_ID);

  // match each dog name entry in sheet with copied image file
  // then write file id into sheet
  for (const i in sheetDataArray) {
    const sheetDogName = sheetDataArray[i][0];
    const fileFound = copiedPhotosArray.find((file) => matchFileWithSheet(file.name, sheetDogName));
    if (fileFound) {
      writeToSheet(SHEET_ID, `B${parseInt(i) + 2}`, fileFound.id);
    }
  }
};

run();