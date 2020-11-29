const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');


process.env.NODE_ENV = 'production';

module.exports = {
	mode: 'production',
	target: 'web',
	devtool: 'source-map',
	entry: './src/index',
	output: {
		path: path.resolve(__dirname, "build"),
		publicPath: '/',
		filename: 'bundle.js'
	},
	
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css"
		}),

		// Display bundle stats
		new webpackBundleAnalyzer.BundleAnalyzerPlugin({ analyzerMode: "static" }),

		new HtmlWebpackPlugin({
			template: "src/index.html",
			favicon: "src/favicon.ico",
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDocType: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJs: true,
				minifyCss: true,
				minifyUrls: true
			}
		}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
			"process.env.API_URL": JSON.stringify("http://localhost:3001")
		})
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ["babel-loader", "eslint-loader"]
			},
			{
				test: /(\.css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [require('cssnano')],
							sourceMap: true,
						}
					}
				],
			}
		]
	}
}