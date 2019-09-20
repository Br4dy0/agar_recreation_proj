const path = require("path");
module.exports = {
  mode: "development",
  devtool: "none",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "final"),
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
  }
};