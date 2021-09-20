## Inspired by a coding interview problem
The challenge has been modified from the original tech interview problem to avoid copyright issues from the employer. The Google Drive and Google Sheets used are not the same as the one provided in the interview. All images in the Google Drive are royalty free from https://pixabay.com/ 
<br />

The following Google Drive contains a Google Sheets file which has a list of dog breeds and file ids for Google Drive\
https://drive.google.com/drive/u/0/folders/1wM23wwuuhuQY9S_LnEGE_1SvbSeWVqcD

The following Google Drive contains 3 folders of image files for the dogs.\
https://drive.google.com/drive/u/0/folders/10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH

The image file name is close to the dog name in the Google Sheets, but can be different. (ex: Corgi has a corresponding image: "standing CORGI.jpg")

### Challenge
Build a command line code to loop through the Google Sheets and main image folder (including sub-folders). Find the closest matching image for each dog, copy all the images to a new folder and name the folder all-dog-images-{your name}. Rename all the image files to lowercase, keep file extension, and replace the space in the image file name with “-”, remove the none letter and none number characters in the file name. (ex: standing-corgi.jpg) Update the final image id in the Google Sheets.

### Hint
Use the Google Drive and Google Sheet API to access, create and update Google Sheets and Google Drive files

### API references
https://developers.google.com/drive/api/v3/about-auth \
https://developers.google.com/drive/api/v3/quickstart/nodejs \
\
set-up and authorize client tutorial: \
https://www.youtube.com/watch?v=1y0-IfRW114

## Project set-up and solution

### Install dependencies
`npm install`

### Run solution with Node.js
`node .`