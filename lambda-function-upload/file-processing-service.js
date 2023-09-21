const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const util = require('./util');

const bucketName = 'filesurfer-file-upload-storage';
const s3SubFolder = 'data';

async function process(requestBody){
    const fileName = requestBody.split('\r\n')[1].split(';')[2].split('=')[1].replace(/^"|"$/g, '').trim();
    let fileContent = requestBody.split('\r\n')[4].trim();
    let email = requestBody.split('\r\n')[8].trim();
    const params = {
        Bucket: bucketName,
        Key: `${s3SubFolder}/${fileName}`,
        Body: fileContent,
        Metadata: {
            'email': email,
        }
    }
    await s3.putObject(params).promise();
    return util.buildResponse(200);
}

module.exports.process = process;