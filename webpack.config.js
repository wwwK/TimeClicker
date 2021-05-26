const HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
      ],
    })
  ]
};
