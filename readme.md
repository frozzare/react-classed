# react-classed

[![Build Status](https://github.com/frozzare/react-classed/workflows/test/badge.svg)](https://github.com/frozzare/react-classed/actions)
![npm (scoped)](https://img.shields.io/npm/v/react-classed)


Create React components with CSS classes. Perfect when using a CSS framework, e.g [Tailwind](https://tailwindcss.com/).

## Installation

```
npm install --save react-classed
```

## Usage

Create React components with CSS classes, inspired by [styled-components](https://styled-components.com/) and other styled packages.

```js
import React from 'react';
import { render } from 'react-dom';
import classed from 'react-classed';

const Text = classed.p`text-blue-500`;

const Link = classed.a([
    'text-green-500',
    ({ href }) => ({
        'bg-red-500': href && href.startsWith('http')
    })
]);

const App = () => (
    <div>
        <Text>Blue text</Text>
        <Link>A green link</Link>
        <Link href="https://github.com">A green link with red background</Link>
    </div>
)

render(<App />, document.getElementById('root'));
```

Just like a styled package you can create any html tag by using `classed.X`, `classed[x]` and `classed(x)`.

You can also use a existing component that accepts `className` prop:

```js
const Button = props => <button {...props}>{props.children}</button>;
const BlackButton = classed(Button)('bg-black');
```

### Dynamic classnames

You can pass an object or a function that takes a object of props:

```js
// object
const href = true;
const Link = classed.a({
  'bg-red-500': href
});

// function
const Link = classed.a(({ href }) => ({
  'bg-red-500': href && href.startsWith('http')
}));

const App = () => (
    <div>
        <Link>A green link</Link>
        <Link href="https://github.com">A green link with red background</Link>
    </div>
)
```

Functions can return a array of classNames:

```js
const Link = classed.a(({ href }) => ['link', { 'bg-red-500': href && href.startsWith('http') }]);
```

### Array of classNames

We can pass an array of classnames and allow any type of other input:

```js
const Link = classed.a([
    'text-green-500',
    ({ href }) => ({
        'bg-red-500': href && href.startsWith('http')
    })
]);
```

### classnames package

We also support all input types of [classnames](https://jedwatson.github.io/classnames/).

### Additional CSS

We also support additional css and [styled-components](https://styled-components.com/) and [emotion](https://emotion.sh/) `css` functions or any input that are a object with `styles` string property or array of strings.

```js
// template string
const Text = classed.p(`text-blue-500`, `font-weight: bold`);

// styled-components
import { css } from 'styled-components';

// css() => ['font-weight: bold']
const Text = classed.p(`text-blue-500`, css(`font-weight: bold`));

// emotion
import { css } from '@emotion/core';

// css() => { styles: 'font-weight: bold' }
const Text = classed.p(`text-blue-500`, css(`font-weight: bold`));
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)
