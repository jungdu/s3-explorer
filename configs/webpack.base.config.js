const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({path: path.join(__dirname,"..",'.env')});

function getEnvVariables(parsedEnv){
    const result = [];
    const keys = Object.keys(parsedEnv);
    keys.forEach( key => result.push({
        [`process.env.${key}`]: parsedEnv[key]}
    ))
    return result;
}

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin(getEnvVariables(dotenv.parsed))
    ]
};
