
const config = {
    LAMBDA_REGION: process.env.LAMBDA_REGION,

    UPLOAD_TYPE: process.env.UPLOAD_TYPE,
    UPLOAD_LAMBDA_NAME: process.env.UPLOAD_LAMBDA_NAME,
    UPLOAD_LAMBDA_URL: process.env.UPLOAD_LAMBDA_URL,
    
    GRAYSCALE_TYPE: process.env.GRAYSCALE_TYPE,
    GRAYSCALE_LAMBDA_NAME: process.env.GRAYSCALE_LAMBDA_NAME
};

console.log(config)

module.exports = config;