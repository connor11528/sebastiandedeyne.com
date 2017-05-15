---
title: TypeScript With Laravel Mix
date: 16/05/2017
era: Laravel 5.4

description: 
---

In a recent [Spatie](https://spatie.be) project we decided to try [TypeScript](https://typescriptlang.org) for the business critical part of a new application. TypeScript gives static analysis to reduce the chance of introducing bugs and to provide our code with better documentation and tooling (autocompletion!)

*I've created an [example repository on GitHub](https://github.com/sebastiandedeyne/laravel-mix-typescript-example). The readme contains a concise step-by-step checklist for adding TypeScript support to Laravel Mix if you prefer a quick reference over this guide.*

*This post assumes you know the basic concepts Laravel Mix, you know the basic concepts of webpack, and that you're using a somewhat standard Laravel 5.4 installation.*

We've been happily using Laravel Mix since it's release with Laravel 5.4. Luckily, extending mix isn't too hard with some webpack knowledge. One of my favorite features of webpack is the ability to import a file in your application without caring about which type it actually is. As long as you've configured an appropriate loader, you could import anything from a plain old JavaScript file to an animated gif. This means that if we want to support TypeScript with Laravel Mix, we don't need to change any configuration, we need to add the ability to bundle TypeScript files.

Adding TypeScript support is pretty straight forward and is done in three steps: install the necessary dependencies, configure TypeScript, and finally configure Laravel Mix.

## 1) Install The Necessary Dependencies

Let's start with installing the necessary dependencies that Laravel & Mix don't provide out of the box:

```bash
yarn add ts-loader typescript --dev
```

`typescript` is, well, the TypeScript compiler itself, doesn't really warrant an explanation. `ts-loader` is the official webpack *loader* for TypeScript. Webpack uses loaders to determine how it should parse a module that you include in your JavaScript. The `--dev` flag ensures that the two new dependencies are stored in our project's `devDependencies`.

## 2) Configure TypeScript

TypeScript requires a configuration file to work properly. We can create one using `node_modules/.bin/tsc --init`. (no need for the full path if you have a global TypeScript installation) We're not going to dive into the details of configuring TypeScript since that's outside of the scope of this post, the default configuration that appears in the newly created `tsconfig.json` file will do.

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": false,
        "sourceMap": false
    }
}
```

We'll add one more line though. Webpack doesn't need this, but by specifying where our source files are, our editor can provide better type validation & autocompletion. Since we're in a default Laravel installation, our TypeScript files will be located in `resources/assets/js`.

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": false,
        "sourceMap": false
    },
    "include": [
        "resources/assets/js/**/*"
    ]
}
```

## 3) Configure Laravel Mix

Since we're adding a new loader to webpack, we need to modify Mix' webpack configuration. Luckily there's a public method for that so we don't need to do anything hacky: `webpackConfig`, which can be chained to the rest of our Mix configuration in our `webpack.mix.js` file.

Our loader should:

- Only apply to TypeScript files (`.ts` and `.tsx`)
- Transform TypeScript files to JavaScript   with `ts-loader`
- Not care about anything that comes from the `node_modules` folder, we only care about managing our own application code

This boils down to the following loader configuration:

```js
const { mix } = require('laravel-mix');

mix
    .js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css')
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
    });
```

We also don't want to specify file extension whenever we `import` or `require` a TypeScript file, so we'll need to tell webpack to look for `.ts` and `.tsx` files when it has to make a guess. Mix already supports a list of extensions, to ensure we're not breaking anything, we'll copy the original array (which is declared in the `laravel-mix` package) and append our new extensions. This all happens in `resolve.extensions`.

```js
const { mix } = require('laravel-mix');

mix
    .js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css')
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['*', '.js', '.jsx', '.vue', '.ts', '.tsx'],
        },
    });
```

## 4) Write Some TypeScript!

Pretty important, let's see if everything works! We'll start by creating a dead simple TypeScript file, `resources/assets/js/hello-world.ts`

```js
export function helloWorld(): string {
    return 'Hello world!';
}
```

We can require the TypeScript hello world file in our `app.js` file without needing to specify the extension, since we added it to webpack's `resolve.extensions` option.

```js
const helloWorld = require('./hello-world').helloWorld();

console.log(helloWorld);
```

When we open our browser, `Hello world!` appears in the console. Success!

That's it! I've created an [example repository on GitHub](https://github.com/sebastiandedeyne/laravel-mix-typescript-example). The readme contains a concise step-by-step checklist for adding TypeScript support to Laravel Mix if you prefer a quick reference over this guide.