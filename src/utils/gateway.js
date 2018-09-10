require('dotenv').load();

const { log }           =   require('.');
const africastalking    =   require('africastalking');

const gatewayOptions    =   {
        apiKey          :   process.env.AT_API_KEY,
        username        :   process.env.AT_USER_NAME,
        format          :   'json'
};

module.exports          =   africastalking(gatewayOptions);
