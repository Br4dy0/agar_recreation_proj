const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  devtool: "none",
  devServer: {
    contentBase: path.join(__dirname, 'src/js/client'),
    watchContentBase: true
  },
  entry: {
    index: ["./src/js/client/index.js"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "final/js"),
    publicPath: "/final"
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ],
  module:{
    rules:[{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders:[{
        loader:"babel-loader",
        options:{
          presets: ["@babel/preset-env"]
        }
      }]
    }]
  }
};