# GenIoTs

[![Build Status](https://travis-ci.org/orchestratora/gen-io-ts.svg?branch=master)](https://travis-ci.org/orchestratora/gen-io-ts)
[![Coverage](https://img.shields.io/codecov/c/github/orchestratora/gen-io-ts.svg?maxAge=2592000)](https://codecov.io/gh/orchestratora/gen-io-ts)
[![Npm](https://img.shields.io/npm/v/@orchestrator/gen-io-ts.svg)](https://www.npmjs.com/package/@orchestrator/gen-io-ts)
[![Npm Downloads](https://img.shields.io/npm/dt/@orchestrator/gen-io-ts.svg)](https://www.npmjs.com/package/@orchestrator/gen-io-ts)
![Licence](https://img.shields.io/github/license/orchestratora/gen-io-ts.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Generate [io-ts](https://github.com/gcanti/io-ts) codecs for classes by decorating props

## Installation

```bash
$ npm install --save @orchestrator/gen-io-ts
```

## Usage

First decorate your properties that you want to validate:

```ts
// my-class.ts

import { Property } from '@orchestrator/gen-io-ts';

class MyClass {
  @Property() // This will validate `prop` to be a string
  prop: string;
  internalProp: any;
}
```

Now generate codec type for your decorated class:

```ts
// main.ts

import { genIoType } from '@orchestrator/gen-io-ts';

import { MyClass } from './my-class.ts';

const myClassType = genIoType(MyClass);

// Then you can validate the type
myClassType.decode({ prop: 'ok' }); // This will produce Right({prop: 'ok'})
myClassType.decode({ prop: false }); // This will produce Left([...])
```

You can now report any validation errors as usual in [io-ts](https://github.com/gcanti/io-ts):

```ts
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

ThrowReporter.report(myClassType.decode({...})); // This will throw errors
```

**NOTE**: By default every property is optional.
To change it - see [Required property section](#required-property).

## Advanced usage

### Required property

Every property is configured to be NOT required, which means you can assign
`null/undefined` values and validation will not fail.

To change that set `isRequired` option to `true`:

```ts
import { Property } from '@orchestrator/gen-io-ts';

class MyClass {
  @Property({ isRequired: true }) // Will now fail if `null/undefined` was set
  prop: string;
}
```

### Custom type

Allows to override default inferred type with custom:

```ts
import { Property } from '@orchestrator/gen-io-ts';

class MyClass {
  @Property({ type: typeOf(Boolean) }) // Will now allow only booleans instead of strings
  prop: string;
}
```

### Custom type factories

Allows to override/adjust(refine) default type:

```ts
import * as t from 'io-ts';
import { Property } from '@orchestrator/gen-io-ts';

class MyClass {
  @Property({
    typeFactory: type => t.refine(type, str => str.length > 0, 'NotEmpty'),
  }) // Will now allow only non empty strings
  prop: string;
}
```

_See: [`io-ts` Refinements](https://github.com/gcanti/io-ts#refinements) for more usage info._

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
