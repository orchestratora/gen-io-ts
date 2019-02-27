# GenIoTs - Changelog

# [2.1.0](https://github.com/orchestratora/gen-io-ts/compare/v2.0.2...v2.1.0) (2019-02-27)


### Features

* **libs:** update dependencies and fix deprecations ([33661d3](https://github.com/orchestratora/gen-io-ts/commit/33661d3))

## [2.0.2](https://github.com/orchestratora/gen-io-ts/compare/v2.0.1...v2.0.2) (2019-02-07)


### Bug Fixes

* **generator:** safely access reserved exports from `io-ts` ([9513f98](https://github.com/orchestratora/gen-io-ts/commit/9513f98)), closes [#5](https://github.com/orchestratora/gen-io-ts/issues/5)

## [2.0.1](https://github.com/orchestratora/gen-io-ts/compare/v2.0.0...v2.0.1) (2019-02-05)


### Bug Fixes

* **generator:** apply not-required modifiers on custom types ([0b4ea8b](https://github.com/orchestratora/gen-io-ts/commit/0b4ea8b))

# [2.0.0](https://github.com/orchestratora/gen-io-ts/compare/v1.1.1...v2.0.0) (2019-01-27)


### Bug Fixes

* **types:** properly pass arguments in anyOf factory ([57e45ce](https://github.com/orchestratora/gen-io-ts/commit/57e45ce))


### Features

* **io-ts:** make io-ts as a peerDependency ([cc312b2](https://github.com/orchestratora/gen-io-ts/commit/cc312b2))


### BREAKING CHANGES

* **io-ts:** Secondary entrypoint `/io-ts` has been removed. Now it's a peerDependency that
consumer has to install.

## [1.1.1](https://github.com/orchestratora/gen-io-ts/compare/v1.1.0...v1.1.1) (2019-01-24)


### Bug Fixes

* **api:** make runtime types public ([dadca0e](https://github.com/orchestratora/gen-io-ts/commit/dadca0e))

# [1.1.0](https://github.com/orchestratora/gen-io-ts/compare/v1.0.1...v1.1.0) (2019-01-24)


### Bug Fixes

* **types:** use type factories instead of classes ([cfc93ec](https://github.com/orchestratora/gen-io-ts/commit/cfc93ec))


### Features

* **decorator:** add type factory to `@Property` configuration ([aab5c01](https://github.com/orchestratora/gen-io-ts/commit/aab5c01))
* **decorator:** capture extra metadata in @Property ([0e11243](https://github.com/orchestratora/gen-io-ts/commit/0e11243))
* **decorator:** capture extra metadata in @Property ([cc89811](https://github.com/orchestratora/gen-io-ts/commit/cc89811))
* **metadata:** allow to pass extra options via decorator ([268ce10](https://github.com/orchestratora/gen-io-ts/commit/268ce10))
* **metadata:** allow to pass extra options via decorator ([41a3522](https://github.com/orchestratora/gen-io-ts/commit/41a3522))
* **metadata:** merge config from @Property decorator ([80bccf2](https://github.com/orchestratora/gen-io-ts/commit/80bccf2))

## [1.0.1](https://github.com/orchestratora/gen-io-ts/compare/v1.0.0...v1.0.1) (2019-01-23)


### Bug Fixes

* **utils:** isObject - verify object is not an array ([ae909ca](https://github.com/orchestratora/gen-io-ts/commit/ae909ca))

# 1.0.0 (2019-01-21)


### Features

* implement generation of io-ts codec from type ([43a3776](https://github.com/orchestratora/gen-io-ts/commit/43a3776))
* **io-ts:** expose io-ts as secondary entry point ([89c74f6](https://github.com/orchestratora/gen-io-ts/commit/89c74f6))
