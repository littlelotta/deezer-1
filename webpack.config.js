var path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    target: 'electron-renderer',
    entry: [
        './index.jsx'
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/public')
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    context: path.resolve(__dirname, 'src/client'),
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        }),
        new webpack.DefinePlugin({
            "process.env": {
                ELECTRON: JSON.stringify(true)
            }
        })
    ],
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: /src/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-class-properties', 'transform-object-rest-spread'],
                    presets: ['react', 'latest']
                }
            }
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        }, {
            test: /\.less$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
        }, {
            test: /\.(jpg|png|gif|svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: './assets/',
                }
            }]
        }, {
            test: /\.(ttf|eot|woff|woff2)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: './assets/',
                }
            }]
        }]
    }
}