// Google Sheet id of dogs breed list
const SHEET_ID = '1N0IHTEEB7jTqE8YaJeW1BKXC9FrRLJLDDIdWkZWvhb8';

// Google Drive id of the main drive containing sub-folders of dog photos
const DRIVE_ID = '10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH';

const { getFilesInFolder, getSheetData, createFolder, copyFilesTo, matchFileWithSheet } = require('./helpers');


// call Google API
const run = async () => {
  // get content from main drive
  const fileDataArray = await getFilesInFolder(DRIVE_ID);
  
  // go through each subfolder and return the array of photos
  const photosNestedArray = await Promise.all(fileDataArray.map(async (file) => {
    const photo = await getFilesInFolder(file.id);
    return photo;
  }));
  
  // flatten the nested arrays to be just array with objects
  const photosArray = [].concat.apply([], photosNestedArray);
  
  // create new folder in main drive to store copies of files
  // const newFolderId = await createFolder(DRIVE_ID);
  
  // copy renamed files to new folder
  // const copiedNestedPhotosArray = photosArray.forEach(photo => {
  //   copyFilesTo(photo, '19f8Hwbsc9_BBEwOVyNM_47083OYsHgNQ');
  // });

  // array of files with id, name, mimetype
  // const copiedPhotosArray = [].concat.apply([], copiedNestedPhotosArray);
  // console.log(copiedPhotosArray);
  
  // get breed name from sheets
  const sheetDataArray = await getSheetData(SHEET_ID);
  console.log("sheetDataArray", sheetDataArray);

  // match each dog name entry in sheet with copied image file
  // then write file id into sheet
  for (const i in sheetDataArray) {
    const sheetDogName = sheetDataArray[i][0];
    const found = copiedPhotosArray.find(photo => matchFileWithSheet(photo.name, sheetDogName));
    
  }

};

run();