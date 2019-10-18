const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  devtool: "none",
  devServer: {
    contentBase: path.join(__dirname, 'src/test'),
    watchContentBase: true
  },
  entry: {
    index: ["./src/index.js"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "final/js"),
    publicPath: "/final"
  },
  module:{
    rules:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders:[
          {
            loader:"babel-loader",
            options:{
              presets: ["@babel/preset-env"]
            }
          }
        ]
      }
    ]
  },
  plugins:[new webpack.HotModuleReplacementPlugin()]
};