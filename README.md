## Inspired by a coding interview problem
The following Google Drive contains a Google Sheet file which has a list of dog breeds and file ids for Google Drive\
https://drive.google.com/drive/u/0/folders/1wM23wwuuhuQY9S_LnEGE_1SvbSeWVqcD

The following Google Drive contains 3 folders of image files for the dogs.\
https://drive.google.com/drive/u/0/folders/10_HRQGt3nF2S3fc9-JxW4zvxMqIwk0XH

The image file name is close to the dog breed name in the Google Sheet, but can be different. (For example, Corgi has a corresponding image: "standing CORGI.jpg")

### Challenge
Build a command line code to loop through the dogs list Google Sheet and dog image folder (including sub-folders), find the closest matching image for each dog, copy all the images to a new folder and name the folder all-dog-images-{your name}. Rename all the image files to lowercase, keep file extension, and replace the space in the image file name with “-”, remove the none letter and none number characters in the file name, put the final image name into the google sheet. (ex: standing-corgi.jpg)

### Hint
Use the Google Drive and Google Sheet API to access the Google Sheet and Google Drive files

### API references
https://developers.google.com/drive/api/v3/about-auth \
https://developers.google.com/drive/api/v3/quickstart/nodejs \
\
set-up and authorize client tutorial: \
https://www.youtube.com/watch?v=1y0-IfRW114

## Project set-up and run solution

### Install dependencies
`npm install`

### Run solution
`node .`