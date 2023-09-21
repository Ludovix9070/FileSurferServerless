
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const util = require('./util');

const bucketName = 'filesurfer-file-download-storage';
const s3SubFolder = 'data';

async function process(requestBody){
    
    let fileName = requestBody.split(':')[1].trim();
    //let email = requestBody.split('\r\n')[8].trim();
    fileName = fileName.substring(1,fileName.length-2);
    
    console.log("FILENAME: " + fileName)
    
    const params = {
        Bucket: bucketName,
        Key: `${s3SubFolder}/${fileName}`
        /*
        Metadata: {
            'email': email,
        }*/
    }
    
    let isOk = false;
    let url = '';
    
    await s3.getObject(params,
        function (error, data) {
            if (error != null) {
                console.log(error)
            } else {
              isOk = true;
            }
        }).promise();
    
    // your expiry time in seconds.const
    const signedUrlExpireSeconds = 60 * 5 
     
    
    if (isOk){
            url = s3.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: `${s3SubFolder}/${fileName}`,
            Expires: signedUrlExpireSeconds
        })
    }else{
        return util.buildResponse(404, "404 Not found");
    }
    
    console.log("URL: " + url)
    return util.buildResponse(200, url);
}

module.exports.process = process;