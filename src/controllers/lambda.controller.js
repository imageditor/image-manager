const AWS = require("aws-sdk");
const fetch = require('node-fetch');

const {
    LAMBDA_REGION,
    UPLOAD_TYPE,
    UPLOAD_LAMBDA_NAME,
    UPLOAD_LAMBDA_URL,
    GRAYSCALE_TYPE,
    GRAYSCALE_LAMBDA_NAME
} = require('../config/lambda.config')

AWS.config.region = LAMBDA_REGION;
const lambda = new AWS.Lambda();

exports.request = async (type, data, headers) => {
    console.log('lambda request()');
    // console.log(data)

    const lambdaUrl = mapTypeToLambdaNameUrl(type.split('/')[0]) + '/' +  type.split('/')[1];

    const response = await fetch(lambdaUrl, {
        method: 'POST',
        body: data,
        headers: headers
    });
    const body = await response.json();
    console.log(response);
    console.log(body);
    return body;
}

exports.invoke = (processingType, data) => {
    console.log(`lambda invoke()`)
    const lambdaParams = {
        FunctionName: mapTypeToLambdaName(processingType), // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(data)
    };

    // console.log(lambdaParams)

    lambda.invoke(
        lambdaParams,
        lambdaCallback
    )

    return {
        status: 'recieved'
    }
}

const mapTypeToLambdaName = (type) => {
    let lambdaName = null;

    switch (type) {
        case UPLOAD_TYPE:
            lambdaName = UPLOAD_LAMBDA_NAME;
            break;
        case GRAYSCALE_TYPE:
            lambdaName = GRAYSCALE_LAMBDA_NAME;
            break;
        default:
            throw new Error(`Lambda Name for ${type} not configured`);
    };

    return lambdaName;
}

const mapTypeToLambdaNameUrl = (type) => {
    let result = null;

    switch (type) {
        case UPLOAD_TYPE:
            result = UPLOAD_LAMBDA_URL;
            break;
        default:
            throw new Error(`Lambda URL for ${type} not configured`);
    };

    return result;
}

const lambdaCallback = (err, data) => {
    console.log(`lambda invoked()`)
    if (err) {
        console.log(err)
        return {
            status: 'error',
            payload: err
        }
    } else {
        console.log(data)
        if (data.status == '200') {
            return { 
                status: 'recieved',
                payload: {
                    data
                }
            }
        } else {
            return { 
                status: 'error',
                payload: {
                    data: data.payload
                }
            }
        }
    }
}