const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const swaggerAutogen = require('swagger-autogen')();
const localh = process.env.SWAGGERLOCALHOST ? process.env.SWAGGERLOCALHOST : 'meta-wall-backend.herokuapp.com';


/* 幾個要注意的參數 */
/* 第1個 document */
const doc = {
    info: {
        title: 'Meta API',      /* swagger線上文件的名稱 */
        description: '示範範例生成文件'
    },
    host: localh,   /* swagger線上文件打的host(local | heroku) */
    schemes: ['http','https'],                 /* swagger支援的 protocol */
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'headers',
            name: 'authorization',
            description: '必須加上 API Token',

        },
    },

    
};

/* swagger.js  執行後產生的結果文件(.json) */
const outputFile = './swagger-output.json';

/* 程式的進入點 */
const endpointsFiles = ['./app.js'];


/* 3個參數: 1.要輸出的檔案的名稱  2.讀取的檔案    3.document的資料 */
swaggerAutogen(outputFile, endpointsFiles, doc); 