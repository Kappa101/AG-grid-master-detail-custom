const path = require("path");
const fs = require("fs");
const glob = require("glob-all");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = {
  webpack: {
    plugins: [
        new MiniCssExtractPlugin(),
      new PurgecssPlugin({
        paths: [
          resolveApp("public/index.html"),
          ...glob.sync(`${resolveApp("src")}/**/**/*`, { nodir: true })
        ]
      })
    ],
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
        ],
      },
  },
  output: {
    asyncChunks: true,
  },
};