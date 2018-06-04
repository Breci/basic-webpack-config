// created by Jake Tripp March 6, 2018
// while following Matthew Hsiung's videos
// https://www.youtube.com/channel/UCblk3IlXm_ZXkR5OYLuYWaQ/videos

var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");
var webpack = require("webpack");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ETP = require("extract-text-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const processCss = isProduction ? "?minimize!postcss-loader" : "";

module.exports = {
  devtool: "cheap-eval-source-map",
  context: path.join(__dirname),
  entry: {
    vendorCSS: "./js/vendorCSS.js",
    index: "./js/pages/index.js",
    infoPageCSS: "./js/infoPageCSS.js",
    vendor: ["jquery", "popper.js", "bootstrap"],
    results: "./js/pages/results.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: path.join(__dirname, "js")
      },
      {
        test: /\.(css|scss|sass)$/,
        loader: ETP.extract({
          fallback: "style-loader",
          use: `css-loader${processCss}!sass-loader`
        }),
        include: path.join(__dirname, "styles")
      },
      {
        test: /\.(png|jpe?g|svg)$/,
        loader: "file-loader",
        include: path.join(__dirname)
      },
      {
        test: /\.(ejs)$/,
        loader: "ejs-compiled-loader"
      }
    ]
  },
  resolve: {
    alias: {
      styles: path.resolve(__dirname, "styles"),
      images: path.resolve(__dirname, "images")
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    inline: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.ProvidePlugin({
      _: "underscore"
    }),

    customHtmlWebpackPlugin({
      filename: "about.html",
      template: "!!ejs-compiled-loader!./views/about.ejs",
      chunks: ["vendorCSS", "infoPageCSS", "common", "vendor"]
    }),
    customHtmlWebpackPlugin({
      filename: "contact.html",
      template: "!!ejs-compiled-loader!./views/contact.ejs",
      chunks: ["vendorCSS", "infoPageCSS", "common", "vendor"]
    }),
    customHtmlWebpackPlugin({
      filename: "disclaimer.html",
      template: "!!ejs-compiled-loader!./views/disclaimer.ejs",
      chunks: ["vendorCSS", "infoPageCSS", "common", "vendor"]
    }),
    customHtmlWebpackPlugin({
      filename: "404.html",
      template: "!!ejs-compiled-loader!./views/404.ejs",
      chunks: ["vendorCSS", "infoPageCSS", "common", "vendor"]
    }),
    customHtmlWebpackPlugin({
      filename: "500.html",
      template: "!!ejs-compiled-loader!./views/500.ejs",
      chunks: ["vendorCSS", "infoPageCSS", "common", "vendor"]
    }),
    customHtmlWebpackPlugin({
      filename: "incompleteResults.html",
      template: "!!ejs-compiled-loader!./views/incompleteResults.ejs",
      chunks: ["vendorCSS", "infoPageCSS", "common", "vendor"]
    }),
    customHtmlWebpackPlugin({
      filename: "index.html",
      template: "!!ejs-compiled-loader!./views/index.ejs",
      chunks: ["vendorCSS", "index", "common", "vendor"]
    }),

    new HtmlWebpackExcludeAssetsPlugin(),

    new CommonsChunkPlugin({
      name: "common"
    }),

    new ETP({
      filename: "[name].styles.css",
      allChunks: true,
      disable: !isProduction
    })
  ]
};

function chunksSortMode(chunk1, chunk2) {
  var orders = ["vendorCSS", "infoPageCSS", "common", "vendor", "g-page", "index"];
  var order1 = orders.indexOf(chunk1.names[0]);
  var order2 = orders.indexOf(chunk2.names[0]);
  return order1 - order2;
}

function customHtmlWebpackPlugin(specificOptions) {
  let defaults = {
    // hashes the file to prevent bad caching
    hash: true,
    // custom function to inject files in correct order
    chunksSortMode: chunksSortMode,
    // exclude worthless JS files 
    excludeAssets: [/vendorCSS.*.js/, /resultsCSS.*.js/, /infoPageCSS.*.js/],
    minify: { 
      removeComments: true, 
      collapseWhitespace: true
    }
  };
  // cool ES6 spread operator
  // add the default options with whatever else is passed as a parameter
  return new HtmlWebpackPlugin({ ...defaults, ...specificOptions });
}