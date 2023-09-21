const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs'); 

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'filesurfer-dbusers';

async function register(userInfo){
    const email = userInfo.email;
    const password = userInfo.password;
    if(!email || !password){
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(email.toLowerCase().trim());
    if(dynamoUser && dynamoUser.email){
        return util.buildResponse(401, {
            message: 'user already exists in the database, please choose a different email'
        })
    }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10);
    const user = {
        email: email,
        password: encryptedPW
    }

    const saveUserResponse = await saveUser(user);
    if(!saveUserResponse) {
        return util.buildResponse(503, { message: 'Server Error, please try again later.'});
    }

    return util.buildResponse(200, { email: email });
}

async function getUser(email){
    const params = {
        TableName: userTable,
        Key: {
            email: email
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error in getting user: ', error);
    })
}

async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error in saving user: ', error)
    });
}

module.exports.register = register;