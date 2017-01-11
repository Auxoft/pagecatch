webpack= require('webpack');
module.exports =
[
    {
    entry:"./examples/using-script-tag/chrome/background.coffee",
        devtool: "source-map",
        module: {
            loaders: [
                {
                    test: /\.(coffee\.md|litcoffee)$/,
                    loader: "coffee-loader?literate"
                },

                {
                    test: /\.coffee$/,
                    loader: "coffee-loader"
                },

                {
                    test: /\.coffee$/, // include .coffee files
                    exclude: /node_modules/, // exclude any and all files in the node_modules folder
                    loader: "coffeelint-loader"
                },
            ]
        },
        output:
        {
            filename: "background.js"
        }

    },

    {
    entry:"./src/page-catch.coffee",
        devtool: "source-map",
        module: {
            loaders: [
                {
                    test: /\.(coffee\.md|litcoffee)$/,
                    loader: "coffee-loader?literate"
                },

                {
                    test: /\.coffee$/,
                    loader: "coffee-loader"
                },

                {
                    test: /\.coffee$/, // include .coffee files
                    exclude: /node_modules/, // exclude any and all files in the node_modules folder
                    loader: "coffeelint-loader"
                },
            ]
        },
        output:
        {
            filename: "page-catch.js",
            libraryTarget: "var",
            library: "getPage"
        }

    },

    {
    entry:"./src/page-catch.coffee",
        devtool: "source-map",
        module: {
            loaders: [
                {
                    test: /\.(coffee\.md|litcoffee)$/,
                    loader: "coffee-loader?literate"
                },

                {
                    test: /\.coffee$/,
                    loader: "coffee-loader"
                },

                {
                    test: /\.coffee$/, // include .coffee files
                    exclude: /node_modules/, // exclude any and all files in the node_modules folder
                    loader: "coffeelint-loader"
                },
            ]
        },
        plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                dead_code: true,
                warnings: true
            }
        })
        ],
        output:
        {
            filename: "page-catch.min.js",
            library: "page-catch",
            libraryTarget: "umd"
        }

    },
    {
    entry:"./examples/using-require/chrome/background.coffee",
        devtool: "source-map",
        module: {
            loaders: [
                {
                    test: /\.(coffee\.md|litcoffee)$/,
                    loader: "coffee-loader?literate"
                },

                {
                    test: /\.coffee$/,
                    loader: "coffee-loader"
                },

                {
                    test: /\.coffee$/, // include .coffee files
                    exclude: /node_modules/, // exclude any and all files in the node_modules folder
                    loader: "coffeelint-loader"
                },
            ]
        },
        output:
        {
            filename: "background.js"
        }

    }
]
