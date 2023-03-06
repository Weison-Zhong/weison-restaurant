const dotenv = require('dotenv');
dotenv.config();

const envConfig = process.env

export default {
    ...envConfig
}