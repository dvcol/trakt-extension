# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.12.0](https://github.com/dvcol/trakt-extension/compare/v1.11.1...v1.12.0) (2024-07-05)


### Features

* **panel:** load selected lists on movie panel open ([04bf36b](https://github.com/dvcol/trakt-extension/commit/04bf36bb98c8d2b059a2187340ebbce77fc72f83))
* **panel:** load selected lists on show panel open ([0a8f4a5](https://github.com/dvcol/trakt-extension/commit/0a8f4a5b97d62393b4102fc707021b2201aefa65))

### [1.11.1](https://github.com/dvcol/trakt-extension/compare/v1.11.0...v1.11.1) (2024-07-03)


### Bug Fixes

* **images:** clear cache on empty staled request & fix cache eviction ([358caf4](https://github.com/dvcol/trakt-extension/commit/358caf4885a8ab6c9c48277602f7ff1f60c72ded))
* **labels:** correctly detect series premier instead of season premier ([3963251](https://github.com/dvcol/trakt-extension/commit/3963251c91e12d9e12c8189b6128b1c793716b2d))

## [1.11.0](https://github.com/dvcol/trakt-extension/compare/v1.10.0...v1.11.0) (2024-07-01)


### Features

* **panels:** adds watched & collection date/time to panels ([5df3af1](https://github.com/dvcol/trakt-extension/commit/5df3af107a16dfa9f7643ecddb76ed9907b563cd))

## [1.10.0](https://github.com/dvcol/trakt-extension/compare/v1.9.0...v1.10.0) (2024-06-21)


### Features

* **client:** adds cancellable promises ([0fb8735](https://github.com/dvcol/trakt-extension/commit/0fb87351898c7cc626170da44b8fd78757a7568a))
* **errors:** adds error management to show store ([0a0e16e](https://github.com/dvcol/trakt-extension/commit/0a0e16eb2fb121823449573425eb8d63dd616d4d))
* **errors:** consolidate errors in service ([f3f1a4c](https://github.com/dvcol/trakt-extension/commit/f3f1a4c2493f90d6218bd80b6015dc39c1d8a5de))


### Bug Fixes

* **cache:** uses textencoder for better size estimate ([3f278a4](https://github.com/dvcol/trakt-extension/commit/3f278a4c71c1e1e1eac5adc391824eda018dbdff))
* **poster:** adds border-radius to image layers ([23f4173](https://github.com/dvcol/trakt-extension/commit/23f4173f85a844e854bea84b74df58c4ef7422d2))
* **test:** correct erroneous path to setup files ([5bb2692](https://github.com/dvcol/trakt-extension/commit/5bb26929fc445200239a5dc613f1ebbf98b88f96))

## [1.9.0](https://github.com/dvcol/trakt-extension/compare/v1.8.0...v1.9.0) (2024-05-27)


### Features

* **cache:** adds cache eviction when nearing capacity ([79585f6](https://github.com/dvcol/trakt-extension/commit/79585f6a5169eeb7e06627a02d53718bb1a68e14))
* **deps:** extract client to dedicated libs ([499db06](https://github.com/dvcol/trakt-extension/commit/499db06a835f99a91895fee9ac1365d3442f77f4))


### Bug Fixes

* **scripts:** fix typo in prepare script ([2eea1ff](https://github.com/dvcol/trakt-extension/commit/2eea1ff3477f57cf99e1f93d5fdfee4314109fb6))

## [1.8.0](https://github.com/dvcol/trakt-extension/compare/v1.7.2...v1.8.0) (2024-04-26)


### Features

* **settings:** rework context menu and add toggle settings ([6d7b9be](https://github.com/dvcol/trakt-extension/commit/6d7b9bec331bcaaeb83923614e7351c9807fdffc))

### [1.7.2](https://github.com/dvcol/trakt-extension/compare/v1.7.1...v1.7.2) (2024-04-26)


### Bug Fixes

* **background:** refresh onClicked outside of onInstalled ([8bea70f](https://github.com/dvcol/trakt-extension/commit/8bea70f3d3b056074290cab1548c8c4ebfbee98d))

### [1.7.1](https://github.com/dvcol/trakt-extension/compare/v1.7.0...v1.7.1) (2024-04-22)


### Bug Fixes

* **logs:** adds debug logs in background script ([76c8b3d](https://github.com/dvcol/trakt-extension/commit/76c8b3d01d40b72b63a9d34101c3330eaf3043f2))

## [1.7.0](https://github.com/dvcol/trakt-extension/compare/v1.6.1...v1.7.0) (2024-04-21)


### Features

* **context:** adds a context menu to add to search history only ([292ad18](https://github.com/dvcol/trakt-extension/commit/292ad18cf1378f46676cdc678b8a5420525dcb58))

### [1.6.1](https://github.com/dvcol/trakt-extension/compare/v1.6.0...v1.6.1) (2024-04-20)


### Bug Fixes

* **context:** fix null pointer in open in extension context menu ([df868c1](https://github.com/dvcol/trakt-extension/commit/df868c10b388cc36ba63f1ba50fe455bcebebb03))

## [1.6.0](https://github.com/dvcol/trakt-extension/compare/v1.5.0...v1.6.0) (2024-04-20)


### Features

* **router:** adds base path to history when restoring last route ([e2a2e9d](https://github.com/dvcol/trakt-extension/commit/e2a2e9dc7a047ded649869b9d3d756b3fb63bdd1))
* **router:** adds default tab selector and fix restore toggles ([b711fb2](https://github.com/dvcol/trakt-extension/commit/b711fb20cff0291274c37a6e7e5cbd1bde08e4d6))


### Bug Fixes

* **test:** adjust cache flakyness and fix object tests ([ec0bf9b](https://github.com/dvcol/trakt-extension/commit/ec0bf9bb605ffdc3e29f7a239f71be1972f57353))

## [1.5.0](https://github.com/dvcol/trakt-extension/compare/v1.4.4...v1.5.0) (2024-04-19)


### Features

* **context:** adds open in context menu ([8f164b9](https://github.com/dvcol/trakt-extension/commit/8f164b955c55f8cf7f4c87d3ae6996cbea63b256))


### Bug Fixes

* **date:** fix date to be based on locale and not navigator ([24a094e](https://github.com/dvcol/trakt-extension/commit/24a094e6153d9f0b952bcf0a0665540c8b3c82e8))
* **loading:** adds loading bar to progress page too ([38cd65c](https://github.com/dvcol/trakt-extension/commit/38cd65c2bd411715415f9a3a826ac43e1d3ebb6e))
* **security:** obscur secrets with env variables ([b8a69fc](https://github.com/dvcol/trakt-extension/commit/b8a69fc5e77be53c149e197a00c23e891fd5a920))
* **test:** increases retention to prevent flakiness ([447a139](https://github.com/dvcol/trakt-extension/commit/447a139ad4281fdaaa732f2b43bb5c15a236b88c))
* **tests:** adds env variable for testing purposes ([54dec62](https://github.com/dvcol/trakt-extension/commit/54dec62802ffdcb95654f136940ed420f831bfdc))

### [1.4.4](https://github.com/dvcol/trakt-extension/compare/v1.4.3...v1.4.4) (2024-04-17)


### Bug Fixes

* **settings:** adds interpolation description ([b1339e1](https://github.com/dvcol/trakt-extension/commit/b1339e14b0bf5fb0df09221061a6349cfdc51537))

### [1.4.3](https://github.com/dvcol/trakt-extension/compare/v1.4.2...v1.4.3) (2024-04-17)


### Bug Fixes

* **about:** fix external links in about page ([dc4496a](https://github.com/dvcol/trakt-extension/commit/dc4496afa9858bd6bca2838ac1d40ba347257cb9))
* **login:** fix hardocded extension id in redirection url ([3d35a79](https://github.com/dvcol/trakt-extension/commit/3d35a7967711afd81a60e681072d5e48799215df))
* **web:** ensure only one instance of globals are used & fix router ([1efd934](https://github.com/dvcol/trakt-extension/commit/1efd9348c28290c0c0726d3b5a5c8b389aeb7ae7))

### [1.4.2](https://github.com/dvcol/trakt-extension/compare/v1.4.1...v1.4.2) (2024-04-16)


### Bug Fixes

* **routing:** switch to Calendar as default route ([6d3f663](https://github.com/dvcol/trakt-extension/commit/6d3f66342b9d7048d2a0abd3ad782c3b31a8eb7d))
* **text:** fix default spacing ([c4f12aa](https://github.com/dvcol/trakt-extension/commit/c4f12aabf94853b521c7ebdbfccbe3f9ae4072fb))

### [1.4.1](https://github.com/dvcol/trakt-extension/compare/v1.4.0...v1.4.1) (2024-04-15)


### Bug Fixes

* **cache:** evict calendar cache on collection and watchlist ([6b611da](https://github.com/dvcol/trakt-extension/commit/6b611da85b79d21f625cadd978d7b694a45507d0))

## [1.4.0](https://github.com/dvcol/trakt-extension/compare/v1.3.0...v1.4.0) (2024-04-15)


### Features

* **about:** adds about page buttons ([d314aea](https://github.com/dvcol/trakt-extension/commit/d314aea24c9c5ce0240438ea4bc31aa45b6a543a))
* **logout:** adds logout button to the settings page ([17a11ba](https://github.com/dvcol/trakt-extension/commit/17a11ba703adb872213e3b4a4702c4734ba7d3ee))

## [1.3.0](https://github.com/dvcol/trakt-extension/compare/v1.2.0...v1.3.0) (2024-04-15)


### Features

* **about:** create empty about component ([ce937ee](https://github.com/dvcol/trakt-extension/commit/ce937ee1b6daa122ecb5d9559b0a4f693bcff639))
* **account:** support multiple accounts logout/login ([020686f](https://github.com/dvcol/trakt-extension/commit/020686f1d8f24a19046e3fd1e11b3c1ffd846388))
* adds tvdb api ([4e5b974](https://github.com/dvcol/trakt-extension/commit/4e5b97411484000a91715e345337532c3e059446))
* **avatar:** use fallback when fetch fails ([e00ec19](https://github.com/dvcol/trakt-extension/commit/e00ec196a78d0da2f92340d74de2160e74b293d7))
* **backgrounds:** adds grid hover background ([3f789bd](https://github.com/dvcol/trakt-extension/commit/3f789bde207aae76e7b212bd81e24057e6b2c3d9))
* basic auth persist ([d9ad9c7](https://github.com/dvcol/trakt-extension/commit/d9ad9c7ea64052877605abc4b17f5d5ab811b350))
* **bundle:** manual chunk clients ([e246d52](https://github.com/dvcol/trakt-extension/commit/e246d52520e8e2989a25c94ad953ef5363158b88))
* **bundle:** move endpoint import to actual clients instead of base ([735c13a](https://github.com/dvcol/trakt-extension/commit/735c13ad8bc860ff4aa036f9b37b3dc6d068ccdb))
* **button:** adds a go back to top floating button ([b9ecd5f](https://github.com/dvcol/trakt-extension/commit/b9ecd5ffecc662b7e10dad601b5ce01f972fdf1b))
* **cache:** adds cache evicting on last activities ([fd3c7db](https://github.com/dvcol/trakt-extension/commit/fd3c7db90451f3f084766c3aa4af27f9ad763168))
* **cache:** adds eviction method to cached functions ([8e454c9](https://github.com/dvcol/trakt-extension/commit/8e454c93d0bb43fe4cb18bc87f81996b97cf7d7a))
* **cache:** create chrome storage cache ([1551d1f](https://github.com/dvcol/trakt-extension/commit/1551d1fa1596383a560b967ee91fe0bec134d253))
* **cache:** disable caching for DELETE, POST, PUT and auth endpoints ([6c26cb0](https://github.com/dvcol/trakt-extension/commit/6c26cb06362c63d06cb931395e5d56d48b89e6d9))
* **calendar:** adds basic support for calendar ([24a11d3](https://github.com/dvcol/trakt-extension/commit/24a11d381fcfc2dad1e7a6c4a4ef075d85af5728))
* **calendar:** adds empty placeholder ([e0c46b7](https://github.com/dvcol/trakt-extension/commit/e0c46b71dd5f1ab057736ab7231a95600ebbe9ef))
* **calendar:** adds filtering support ([5a7d2bf](https://github.com/dvcol/trakt-extension/commit/5a7d2bf3b07dc21dc874cf2d1689c63f105e5deb))
* **calendar:** adds infinite scroll ([8f3cd5d](https://github.com/dvcol/trakt-extension/commit/8f3cd5d3afaeb882347d33e471f81eee585b2e64))
* **calendar:** adds recenter button ([09f82f8](https://github.com/dvcol/trakt-extension/commit/09f82f87cc1d51435ba5a80fdcca399a8408bbdf))
* **client:** improve cache support cache hit & eviction ([a433d98](https://github.com/dvcol/trakt-extension/commit/a433d98d2fd785ceb95a8998a4dd97825a58faa2))
* **clients:** create minimal env for auth ([8908d3a](https://github.com/dvcol/trakt-extension/commit/8908d3afc85a6a5557a0a13c9eac0ca5121534ec))
* **date:** adds date to list scroll ([c3cbbc5](https://github.com/dvcol/trakt-extension/commit/c3cbbc5b521cb3e4df4ab2ac3f44351612b70450))
* **drawer:** adds item drawer view ([a69babf](https://github.com/dvcol/trakt-extension/commit/a69babf77229857f39b1492033803b94458d204e))
* **drawer:** initial aside panel commit ([95781a2](https://github.com/dvcol/trakt-extension/commit/95781a2fd5cc0301ee97021b7dc4316efc1e4bed))
* **error:** adds error handling to views data fetch ([a58d9db](https://github.com/dvcol/trakt-extension/commit/a58d9db027b0ecaf3d3b25c9651b5a4f730648ff))
* **history:** adds basic history infinite scroll ([dc43e28](https://github.com/dvcol/trakt-extension/commit/dc43e28ba8ac943f4d4e387d2b08b52ca0e103b2))
* **history:** adds history store and enable nabar filtering ([09a0903](https://github.com/dvcol/trakt-extension/commit/09a0903e9568a16eed921fd99c3c659fe5d797c3))
* **history:** adds search and page size support to navbar ([1ed14d3](https://github.com/dvcol/trakt-extension/commit/1ed14d39e8f721f654617c195611ca97dbab965a))
* **history:** split components to make them reusable ([001b2cf](https://github.com/dvcol/trakt-extension/commit/001b2cfb4c8dd119e0597de9ccf8b24c43507f18))
* **history:** widen search matching algorithm ([dcd6816](https://github.com/dvcol/trakt-extension/commit/dcd6816c8cd881806cafedfe2d0e85bc0ae52659))
* **i18n:** translate empty component ([2457645](https://github.com/dvcol/trakt-extension/commit/2457645f732a9f9df7605ea3adbe47b7355ddcae))
* **i18n:** translate panel labels ([431d410](https://github.com/dvcol/trakt-extension/commit/431d4107d0accedc09b4ebd15051e5181f9af3f3))
* **icons:** added nice icons for navbar ([df05845](https://github.com/dvcol/trakt-extension/commit/df0584587f8d0e3fdbf36c096c2f0b0cdaf76b2c))
* **image:** init image store ([d3cee27](https://github.com/dvcol/trakt-extension/commit/d3cee276e74237d33bdb6d692a84df6de62f6ae9))
* implement tvdb auth ([601dfe5](https://github.com/dvcol/trakt-extension/commit/601dfe558cb5d6943515fc380e3a59205c1dfcce))
* **lib:** adds naive-ui ([090ca5a](https://github.com/dvcol/trakt-extension/commit/090ca5ad1ae1df75ba6aeb99d924a4c95f9296f8))
* **links:** adds custom links and alias integration ([b7d7ede](https://github.com/dvcol/trakt-extension/commit/b7d7ede0beef47ba54f9e45ce3f4fa8b8f6a3224))
* **links:** adds hover title for external links ([5ef92e5](https://github.com/dvcol/trakt-extension/commit/5ef92e5be1caef3243847615c9278041f0bfef27))
* **links:** adds open links in background toggle ([116b8b9](https://github.com/dvcol/trakt-extension/commit/116b8b9c644708404f2d9771061dee2752529d97))
* **links:** allow opening tag links in background ([da75a0d](https://github.com/dvcol/trakt-extension/commit/da75a0de747fe9c73f7c23bcf989075b72df7f24))
* **list:** adds support for favorites & fancy icons ([589f469](https://github.com/dvcol/trakt-extension/commit/589f4691c7a72e095483997a02fe26b138fbd12f))
* **list:** adds support to person in lists ([55fb60b](https://github.com/dvcol/trakt-extension/commit/55fb60b5e0480ea81e64f2df81ed6f463723a30e))
* **list:** change caching strategy and adds today indicator ([6c8e08e](https://github.com/dvcol/trakt-extension/commit/6c8e08efeac379f398d6c2b9415f8c8a172773d7))
* **list:** connect store to scroll list ([b96676e](https://github.com/dvcol/trakt-extension/commit/b96676e0a19c007aa05e19c2320b930346ee6048))
* **list:** create lists store and connect navbar ([a24775b](https://github.com/dvcol/trakt-extension/commit/a24775bcd11121777107f939f7e30eed72e5ae92))
* **list:** create navbar list and basic fetching ([e7a3872](https://github.com/dvcol/trakt-extension/commit/e7a3872160b9fd7aa8a3c0f532bdf71e5ede14a0))
* **List:** groups list item by date ([e6e1208](https://github.com/dvcol/trakt-extension/commit/e6e120855f7bc4bc369f41e5b4bd1d8383ce94ac))
* **listItem:** refactor list item to be more composable ([c90ed78](https://github.com/dvcol/trakt-extension/commit/c90ed78dd2ae77ccf3820e09a00d047b3f53a497))
* **listItem:** rework list item to separate by date ([1f27433](https://github.com/dvcol/trakt-extension/commit/1f27433004dbf7c52a789a78b509a117237b9a82))
* **load-more:** adds a load more button ([057a93d](https://github.com/dvcol/trakt-extension/commit/057a93d82c09b204cade6d05ea1e13fdf45d6515))
* **loading:** adds loading bar service ([4174de1](https://github.com/dvcol/trakt-extension/commit/4174de1c14d5db9c7fa94999e34c8da4fe1bac79))
* **login:** rework login to skip fetch ([a334194](https://github.com/dvcol/trakt-extension/commit/a3341945dc9bf95be140f8f7d822a0be70813f09))
* **login:** style login component ([6230287](https://github.com/dvcol/trakt-extension/commit/623028778be2e20e6bf10e73b047bcb4527908ea))
* **logs:** adds settings logs card ([fb6a1e4](https://github.com/dvcol/trakt-extension/commit/fb6a1e4131648dfc3899996b3f74c9e79caaf339))
* **logs:** proxy console.log with logger function ([a3aef45](https://github.com/dvcol/trakt-extension/commit/a3aef450765a52f3d456f63fc2e40a23ad266e31))
* **navbar:** adds account dropdown tab ([62d84f7](https://github.com/dvcol/trakt-extension/commit/62d84f7232d3b882327103481b646a608011356e))
* **navbar:** adds external links to trakt.tv ([b29ddb4](https://github.com/dvcol/trakt-extension/commit/b29ddb46853c8ec1e264f3112fa7026ba86115d8))
* **navbar:** adds initial drawer for additional buttons ([8d7102e](https://github.com/dvcol/trakt-extension/commit/8d7102e5f4b11a05c7a330cd2402e9868a3972fc))
* **navbar:** adds navbar drawer router outlet ([cd0376c](https://github.com/dvcol/trakt-extension/commit/cd0376c45b8bfe31918728d4db86ab37d14a039b))
* **navbar:** adds picker & search to history tab ([4d862b4](https://github.com/dvcol/trakt-extension/commit/4d862b43e0c2c9bd97132e1ae753bbcfa2c73ed1))
* **navbar:** switch to tabs instead of buttons ([fae2d7c](https://github.com/dvcol/trakt-extension/commit/fae2d7ccdd2894e9583b3b01b8a51db30b3a70d2))
* **notification:** create notification service ([ce2e367](https://github.com/dvcol/trakt-extension/commit/ce2e367b091e88b4a910ef061a8f452cb919de66))
* **notification:** update styling and adjust based on navbar state ([f68f9db](https://github.com/dvcol/trakt-extension/commit/f68f9db29173db4811bc6442275f94930294b86f))
* **observable:** adds previous value to broadcast ([17968eb](https://github.com/dvcol/trakt-extension/commit/17968eb7711b231d63574e5616fd1a3a1d21a476))
* **panel:** adds button tooltip & styling, adds collection info ([439225b](https://github.com/dvcol/trakt-extension/commit/439225b31ec614b101c92aea7b79b17cf85a5790))
* **panel:** adds icons to tag links ([670d7c0](https://github.com/dvcol/trakt-extension/commit/670d7c0f7182fab5c62cbdc7be9268d3b53a8348))
* **panel:** adds list state warning & active list ([e17611f](https://github.com/dvcol/trakt-extension/commit/e17611fe4dbd079fe51a71ce3527d354fdacbe20))
* **panel:** adds modal picker to buttons ([206ae01](https://github.com/dvcol/trakt-extension/commit/206ae01d9c551944ee823fbe2f4ea6befcd02ba9))
* **panel:** adds movie button, and disable buttons while loading ([bc99faf](https://github.com/dvcol/trakt-extension/commit/bc99faffe2df60c82e54edfed13110f90261c236))
* **panel:** adds person & movie basic panels ([1b4bb1a](https://github.com/dvcol/trakt-extension/commit/1b4bb1ac6616a5bd7dc4be22750bed2abf8dae41))
* **panel:** adds progress to picker ([e9733d4](https://github.com/dvcol/trakt-extension/commit/e9733d41e27671e533800aa814940e4a7ec94180))
* **panel:** adds remove/cancel labels ([1e0cdb8](https://github.com/dvcol/trakt-extension/commit/1e0cdb820f1daaa47a13046a17e1f6989862299f))
* **panel:** adds season & show hidden link in picker ([f0913e3](https://github.com/dvcol/trakt-extension/commit/f0913e35320a00a0e2fa17ec0b2dc119e16f4ff6))
* **panel:** adds show & season overview support ([a922574](https://github.com/dvcol/trakt-extension/commit/a922574cc366c194523afb73c1a28e1d9f279d39))
* **panel:** adds show details to panel ([f44e113](https://github.com/dvcol/trakt-extension/commit/f44e1137b2071cac21d75f7db7301e0c26e706f6))
* **panel:** adds watched history toggle support ([750ee44](https://github.com/dvcol/trakt-extension/commit/750ee441091e6ffd52c3981bf5c6d4dab8b095e6))
* **panel:** connect store to show panel ([5bddb01](https://github.com/dvcol/trakt-extension/commit/5bddb01c6a5d3011428287cf89ad85be4ecbdbb9))
* **panel:** implement list & collection updates ([0157df6](https://github.com/dvcol/trakt-extension/commit/0157df6771bed633cfa6a37c823cb3354fded913))
* **panel:** refactor overview, rework season picker & loading ([a1e9407](https://github.com/dvcol/trakt-extension/commit/a1e9407f22772b1f2643ee0bed1b900ff7fb0c1f))
* **panel:** refactor panels, adds person details and adds links ([87bd76a](https://github.com/dvcol/trakt-extension/commit/87bd76afbcf004d36ed06194cf6a8fcee1c2924c))
* **panel:** refactor show panel ([e748f20](https://github.com/dvcol/trakt-extension/commit/e748f20de4c8f4d50ab59a9eb7fa8fff7d61e9ab))
* **panel:** refresh list view on panel close ([a7ec4e2](https://github.com/dvcol/trakt-extension/commit/a7ec4e2029f02cd97a046afbcedf8fe87db2bcdf))
* **panel:** support release date ([db5e325](https://github.com/dvcol/trakt-extension/commit/db5e3254fdd2d1fe8f1a00c8fb73449f74dc6605))
* **panel:** translate notification with i18n and adjust styling ([0f15097](https://github.com/dvcol/trakt-extension/commit/0f150976ca7d599f1db55de514c56bf2863e54e8))
* **poster:** make backdrop more generic & localise posters ([0581017](https://github.com/dvcol/trakt-extension/commit/05810176412ad8204e1deba6ca004d3f95fae322))
* **poster:** refactor poster in dedicated component ([81ddf7f](https://github.com/dvcol/trakt-extension/commit/81ddf7fbd79275f8fe4eb17f2cc9d57cb7360577))
* **progress:** adds hover tooltip ([b8b00e4](https://github.com/dvcol/trakt-extension/commit/b8b00e4a87e37a523642f460fcd0ad60f92f86ef))
* **progress:** adds initial progress view ([deca6c5](https://github.com/dvcol/trakt-extension/commit/deca6c5e7faa8415614f4c44149385208b73ede2))
* **progress:** adds logout/sign-in prompt ([261056f](https://github.com/dvcol/trakt-extension/commit/261056f2f0a9a44c0d01e526b24e6aa89eab7704))
* **progress:** adds progress bar ([1b93f2b](https://github.com/dvcol/trakt-extension/commit/1b93f2bf4b133ac685d61b4be7e794214be0ac18))
* **progress:** move progress to store and adds caching ([6ac3cc8](https://github.com/dvcol/trakt-extension/commit/6ac3cc870b51a7d174da632e4bb47f989c4c3cc7))
* **refactor:** makes list and empty generic re-usable components ([13e97d1](https://github.com/dvcol/trakt-extension/commit/13e97d1c7c00bbf16eb2aa72df459440ab092497))
* **restore:** restore service state on init ([8e49fd1](https://github.com/dvcol/trakt-extension/commit/8e49fd196e7304ae150e30a7e1aaea10f35f0000))
* **router:** create about route ([1ad86b3](https://github.com/dvcol/trakt-extension/commit/1ad86b3a9c03acf2c3acd149cf07fbbb8e396bf2))
* **scaffolding:** add initial folder structure ([d87e2bb](https://github.com/dvcol/trakt-extension/commit/d87e2bbe32c20d858abe75188f199c1cb76a006c))
* **search:** adds search memory & history ([e943b1f](https://github.com/dvcol/trakt-extension/commit/e943b1fa4351c4ad41ef32c7deb2eb2e96110cbd))
* **search:** create navbar search component ([3b3e93c](https://github.com/dvcol/trakt-extension/commit/3b3e93c8ccb7e329bdc4be79a482f1fa288fec1a))
* **search:** implement search page ([4c92c54](https://github.com/dvcol/trakt-extension/commit/4c92c54c118db7e761d570a7c263c87232f3c0f1))
* **settings:** adds account cards in settings ([39ec0a8](https://github.com/dvcol/trakt-extension/commit/39ec0a887df60908a0bc4360635cd9720a0611dc))
* **settings:** adds cache settings card ([2d507f4](https://github.com/dvcol/trakt-extension/commit/2d507f4d6998dc21ae7f13c4f77de80a74b79260))
* **settings:** adds link settings card ([5076f2a](https://github.com/dvcol/trakt-extension/commit/5076f2a3de85e36b218336550609a7e164de435f))
* **settings:** adds settings tabs card ([211cf66](https://github.com/dvcol/trakt-extension/commit/211cf660d63e08e2149905072ef9b5d5e97b2f11))
* **settings:** create wrapper component ([3802384](https://github.com/dvcol/trakt-extension/commit/380238475e8396e43aa09976fce2063b42c0fed7))
* **settings:** persist credentials for services ([746e26e](https://github.com/dvcol/trakt-extension/commit/746e26ec9c0d320c28a7ac869ee704292d3e82a0))
* **settings:** refactor settings form ([20ae9ab](https://github.com/dvcol/trakt-extension/commit/20ae9abdb2823b1f1558c71bccff028ff98ae574))
* **store:** adds multi account support ([32a3e78](https://github.com/dvcol/trakt-extension/commit/32a3e78f734b06908be286bbbbf8ecefe8201cf5))
* **tags:** adds open link on click ([ba0c3f6](https://github.com/dvcol/trakt-extension/commit/ba0c3f691eea6026144d9cc00d1ca3c86a81cf6a))
* **tags:** increase tags saturation on hover ([3c0a342](https://github.com/dvcol/trakt-extension/commit/3c0a3422e49ff73394782b1ea3c6680a0bec0b89))
* **tags:** rework tags and episode display ([e08aea3](https://github.com/dvcol/trakt-extension/commit/e08aea399659cdbabdfa698c2c16d9c81757e941))
* **theme:** adds dark/light theme switch ([dcb5a55](https://github.com/dvcol/trakt-extension/commit/dcb5a55f03d4354362ddd844b096dc22a7adde53))
* **tmdb:** add endpoints ([6c2ba7b](https://github.com/dvcol/trakt-extension/commit/6c2ba7bc05affad24ec6d0d85b213675c49beca5))
* **tmdb:** adds initial service ([3b49030](https://github.com/dvcol/trakt-extension/commit/3b49030a86827d6fd6451c7203acd6f230b7f453))
* **tmdb:** adds movie endpoints ([32833eb](https://github.com/dvcol/trakt-extension/commit/32833ebbac83284f53443f29ece8697fe84954f7))
* **tmdb:** create v4 endpoint ([1e0ee52](https://github.com/dvcol/trakt-extension/commit/1e0ee52a35638e58b88e1a86331982480d54afc3))
* **tmdb:** rework auth ([288566a](https://github.com/dvcol/trakt-extension/commit/288566ab28e93dc954dbd6ac883843ecfaa9c0b0))
* **trakt-client:** adds cache support to endpoints ([b369463](https://github.com/dvcol/trakt-extension/commit/b369463d575bab1457a4c1d58958f1e0f6a44bfc))
* **trakt-client:** create initial trakt client  ([#112](https://github.com/dvcol/trakt-extension/issues/112)) ([3f6f668](https://github.com/dvcol/trakt-extension/commit/3f6f668dd9209e5352a5ba6ea4f5171ed7b62080))
* **traktv-service:** implements authentication & adds unit testing ([#117](https://github.com/dvcol/trakt-extension/issues/117)) ([8c5242f](https://github.com/dvcol/trakt-extension/commit/8c5242fb0b11c1259184bce71e807b15dcccb860))
* **transition:** adds basic route transition ([ee10249](https://github.com/dvcol/trakt-extension/commit/ee10249af5c86971f9022115d595e943d41b1a5b))
* **unit-test:** covers base-client and optimise trakt-client UT ([e7238be](https://github.com/dvcol/trakt-extension/commit/e7238be948534d1f780bdf4486baddde7f14a3af))
* **web:** fix web routing and adds last route restore ([d5da030](https://github.com/dvcol/trakt-extension/commit/d5da0304cf26962e142a077c0c859eadef1453fa))
* **web:** fix web routing, create app state, add loading route ([6881638](https://github.com/dvcol/trakt-extension/commit/688163858ff926e4c7492bc95ae2ea544373fe32))
* **web:** use local storage when not in extension context ([5933d69](https://github.com/dvcol/trakt-extension/commit/5933d690f2eabc48e08dfa07f793e1a99b709b87))


### Bug Fixes

* **base-client:** adds type inference to param & body ([b41a01a](https://github.com/dvcol/trakt-extension/commit/b41a01a8297a3f1ac8581f0862aace649371ddd7))
* **base-client:** fix falsy filter for param interpolation ([ccb3e48](https://github.com/dvcol/trakt-extension/commit/ccb3e482ab8ecd511bae958f456756f0602caefc))
* **base-client:** support more flexible date formats ([4063e40](https://github.com/dvcol/trakt-extension/commit/4063e40a2fbd4a11762e78ea086998ead2456387))
* **browser:** access chrome through window for browser without global ([b9c7811](https://github.com/dvcol/trakt-extension/commit/b9c781181a8f57fbc244ba9ec47717ffe4d9ec92))
* **bundle:** use minimal conf to allow treeshaking ([f5ab7c2](https://github.com/dvcol/trakt-extension/commit/f5ab7c21b3accef70653c17e18cd63242e3efa78))
* **cache:** change progress fetch & calculation and fix eviction check ([f618ec4](https://github.com/dvcol/trakt-extension/commit/f618ec4156d1cba6669711dcf08c308362d2036f))
* **cache:** rework cache clear to only evict with a regex pattern ([fad8a36](https://github.com/dvcol/trakt-extension/commit/fad8a3646fb126760c1f4932b50838d458d370c8))
* **cache:** store and return cloned response from cache ([4633e16](https://github.com/dvcol/trakt-extension/commit/4633e164a00400b0a042417fc80f12984c5f3aeb))
* **cache:** update cache eviction strategy ([dfa251e](https://github.com/dvcol/trakt-extension/commit/dfa251ecdaa573da6d214af054c29a1139b278d1))
* **calendar:** correct extraneous placeholder at the end of the range ([63f758c](https://github.com/dvcol/trakt-extension/commit/63f758cdd9f78de51a41bf0afdf3bc969b117ff0))
* **css:** adjust blur gradient for panels & navbar ([a4fb08c](https://github.com/dvcol/trakt-extension/commit/a4fb08ce8bab0b3fc626889f1aacfe8833c05b93))
* **css:** simplify navbar css & themed variables ([553ade2](https://github.com/dvcol/trakt-extension/commit/553ade27e7d50db43c568d4781ae15fa3804eae7))
* **dropdown:** fix avatar fallback ([4d38dd2](https://github.com/dvcol/trakt-extension/commit/4d38dd252d67880df20610aa92bcde59c3898589))
* **history:** clear state when switching users ([00c7278](https://github.com/dvcol/trakt-extension/commit/00c7278ab8ce81213c8a8417a707f428e55a619f))
* **hmr:** fix broken hmr ([259003e](https://github.com/dvcol/trakt-extension/commit/259003ea7d27925dc7bafdadfe8a3ed758b9ce0f))
* **hmr:** fix hot module replacement in extension ([dd2f575](https://github.com/dvcol/trakt-extension/commit/dd2f575e04c3c34db7e722d6aa3e391481a4625e))
* **hmr:** fix i18n hot module replace in browser mode ([7d2fa14](https://github.com/dvcol/trakt-extension/commit/7d2fa14b5770d4f4e9adcc7d02950aa8148690e9))
* **i18n:** add base url in i18n fetching ([9adf5a7](https://github.com/dvcol/trakt-extension/commit/9adf5a7b085adf50a37ddecd1a57ab50593db1a4))
* **i18n:** merge hmr locale injection instead of discarding ([20feabf](https://github.com/dvcol/trakt-extension/commit/20feabf2305772acb2713018c12776999063e936))
* **image:** adds image size selector & fix placeholder ([af8f122](https://github.com/dvcol/trakt-extension/commit/af8f122143165dcc2a85b3060bc2e031311ddbe9))
* **image:** correct image loading strategy ([f9cb196](https://github.com/dvcol/trakt-extension/commit/f9cb196ba65df98a758679011ae3bfdb6f460ce4))
* **image:** fetch images only when list item renders ([ee106c7](https://github.com/dvcol/trakt-extension/commit/ee106c788e0c340212d6e6c2c5a32ee82b89c35b))
* **images:** adds a timeout threshold to enable transition ([92ef9cf](https://github.com/dvcol/trakt-extension/commit/92ef9cfe2fdee4dee20955da62373c762b25680b))
* **image:** switch to support backdrops in addition to posters ([d683592](https://github.com/dvcol/trakt-extension/commit/d683592e9ec551446cf5eb0ad56121a017b08da0))
* **lib:** fix naive-ui style injection ([aba46ea](https://github.com/dvcol/trakt-extension/commit/aba46ea6c3f0db613a5dd99972fe40ac240801e2))
* **list:** adjust styling and make poster width a variable ([2bc08fd](https://github.com/dvcol/trakt-extension/commit/2bc08fd7aceff5471e386cb10d046a4b48529701))
* **list:** change key to index since trakt api can return duplicates ([df788d3](https://github.com/dvcol/trakt-extension/commit/df788d3d58d4f1352463afb208becbfe6c9b56ee))
* **list:** improve render performance ([51d818d](https://github.com/dvcol/trakt-extension/commit/51d818dc210879f484ff34c0ff17925d5682e0e0))
* **loading:** fix styling and loading indicator ([f0709f4](https://github.com/dvcol/trakt-extension/commit/f0709f40ea23a3009c0277ad4f91e709659fde27))
* **login:** strip code once auth successfull ([eb79719](https://github.com/dvcol/trakt-extension/commit/eb79719d25395b4768dd535e9c17cdbbd9244d0e))
* **logo:** fix svg resolution for the logged out logo ([5fd5f7d](https://github.com/dvcol/trakt-extension/commit/5fd5f7d089abb545bb10eb54ad4ba10839fdc2fc))
* **navbar:** adds missing settings page as possible active route ([9035f20](https://github.com/dvcol/trakt-extension/commit/9035f20c98615d1d198836d7db05b9cc32013e76))
* **navbar:** change wording & switch to auto-complete ([dd66366](https://github.com/dvcol/trakt-extension/commit/dd66366078e4f4e3b2dfe553f52fe60d87348d8b))
* **navbar:** disable navbar selectors when loading http calls ([48ad270](https://github.com/dvcol/trakt-extension/commit/48ad2701db14b4559fb075c29350aa51bccfd7c2))
* **navbar:** keep drawer open on focus within ([51ef1e2](https://github.com/dvcol/trakt-extension/commit/51ef1e2386d3b1c6e0735783cf137dc24577dfe3))
* **navbar:** makes i18n computed ([63ba7ce](https://github.com/dvcol/trakt-extension/commit/63ba7ce73b33e754368bde0cba0ef328f3a5b8a3))
* **panel:** adds loading support & fix scrollbar ([650d7e7](https://github.com/dvcol/trakt-extension/commit/650d7e717b9566cc5b059448f5237c3a8e9f60a0))
* **panel:** adjust margin & fix loading placeholders ([ae22dff](https://github.com/dvcol/trakt-extension/commit/ae22dff5e1d9c9543969b4c0f0c8f173a04c3007))
* **panel:** adjust margin and loading indicators ([d16a742](https://github.com/dvcol/trakt-extension/commit/d16a74267b2ded73a30638bc177f75b1ae5c819c))
* **panel:** fix panel routing and shell loading ([ed6b6f3](https://github.com/dvcol/trakt-extension/commit/ed6b6f3c9f99d2b867eb6a47ca61ad12057d12a5))
* **panel:** remove checkin and fix sizing ([761167d](https://github.com/dvcol/trakt-extension/commit/761167de7304b09503a67373936ba6e9819336a2))
* **panel:** simplify movie fetching ([efd6e1f](https://github.com/dvcol/trakt-extension/commit/efd6e1f4f2bdea3e9df116846548537a702421e6))
* **panel:** simplify show fetching ([d7d0906](https://github.com/dvcol/trakt-extension/commit/d7d09061b7781f0a316a3aabb2660ada740c8477))
* **popup:** adds overflow hidden to prevent unwanted scrollbars ([5945105](https://github.com/dvcol/trakt-extension/commit/5945105e6717e50ba9d4e5ad3031627cd276a100))
* **progress:** fix percentages and hide tooltips when no aired episodes ([bdf0142](https://github.com/dvcol/trakt-extension/commit/bdf01428266d3e530d698c5456ea8dcbb1ffa02c))
* **progress:** fix watched calculation and loading indicator ([0dd32ee](https://github.com/dvcol/trakt-extension/commit/0dd32ee8568d1bddeece2359684f475620f17cf4))
* **proxy:** adds cors proxy when in browser ([1946136](https://github.com/dvcol/trakt-extension/commit/1946136c04aa5393e9890c63852e59845dff6906))
* **redirect:** supports browser origin redirect when not in extension ([0bb898a](https://github.com/dvcol/trakt-extension/commit/0bb898af0ac178671f63c2e54635733680c8c410))
* **router:** fix router restore when last on login page ([f9dfd72](https://github.com/dvcol/trakt-extension/commit/f9dfd72c79aad7cd3a593ed7c6c0ad7510fc1a2b))
* **router:** use name for routing ([1a0da58](https://github.com/dvcol/trakt-extension/commit/1a0da58375f2250cd83a082a09db0f9809314c67))
* **routing:** adds path match to redirect unknown routes ([fe609e7](https://github.com/dvcol/trakt-extension/commit/fe609e758e15f5522366277ce7a67cee10f08f40))
* **scroll:** always show timeline line ([a2433ba](https://github.com/dvcol/trakt-extension/commit/a2433babebe05af938bce4c152d71c9d5c9c0d4b))
* **scss:** fix media query light/dark themes ([8b9d42b](https://github.com/dvcol/trakt-extension/commit/8b9d42bad1eaf4f537c3625b92d0e927f8cab78d))
* **search:** rework the code matching and search ([47ee7a5](https://github.com/dvcol/trakt-extension/commit/47ee7a5d0e7a7f0375e53268e03dd13720d02ccc))
* **services:** switch to options instead of settings in constructor ([6cf524d](https://github.com/dvcol/trakt-extension/commit/6cf524ddfd53a9280534af8bfb406d3605d06397))
* **settings:** adjust scroll offset in settings ([1608983](https://github.com/dvcol/trakt-extension/commit/16089834ad954527a3d4ddbcb635b9ca50d68eed))
* **settings:** rework focus/hover select cards ([71757d8](https://github.com/dvcol/trakt-extension/commit/71757d858d80b19fd5ed998337b78b7f0cf97104))
* **store:** correctly clear reactive proxy when clearing states ([0154260](https://github.com/dvcol/trakt-extension/commit/0154260e8436cf7a4e6f6af5e764378450df1f90))
* **style:** fix transition for background ui ([3875e93](https://github.com/dvcol/trakt-extension/commit/3875e93a75910aab48142ec787e623f2715db7b4))
* **styles:** fix styling ([dfa97e8](https://github.com/dvcol/trakt-extension/commit/dfa97e8c162c17ae38d80c0e09e42adbe34a8c55))
* **tags:** change to bordered tags to increase readability ([425a9ed](https://github.com/dvcol/trakt-extension/commit/425a9ed601710490f117f6a15f1dc27d7132a907))
* **test:** fix logging issues for i18n ([002b7b9](https://github.com/dvcol/trakt-extension/commit/002b7b948da9b9c497b05d4da4f6b5ec3247d059))
* **tests:** mock chrome for vitest tests ([ba6312b](https://github.com/dvcol/trakt-extension/commit/ba6312bd2d2164f7be4f9e261a77ec67d9593ad4))
* **tooltip:** close tooltip on trigger ([729436c](https://github.com/dvcol/trakt-extension/commit/729436c5a4ffd91eabcbedf4715e8e8c173c6b51))
* **typing:** fix chrome typing for other browsers ([148b3f6](https://github.com/dvcol/trakt-extension/commit/148b3f607fd0fe86b8b72ba079b84a0b3eb508f6))
* **ui:** auto-resize based on window inner width/height ([0599bc8](https://github.com/dvcol/trakt-extension/commit/0599bc868a691b3fca0b2de9d54986aeb6245609))
* update manifest ([7dc8cf4](https://github.com/dvcol/trakt-extension/commit/7dc8cf48e18904f1f9beccade094bc951c581a9a))
* **wc:** fix index.html color & bg ([dbe5684](https://github.com/dvcol/trakt-extension/commit/dbe56842f4f0f306b00a0d4be4a7fb92d2e88879))
* **web:** change from path to name base item routing ([ce7b8bf](https://github.com/dvcol/trakt-extension/commit/ce7b8bf2ff0d391cbfaa2a73c6fb5be2cabfc252))
* **web:** correctly parse search in bootstrap ([dbbfe91](https://github.com/dvcol/trakt-extension/commit/dbbfe916715208b790a050ef3ea8bd5dce532aad))
* **web:** ensure i18n are loaded before marking ready ([aab0e03](https://github.com/dvcol/trakt-extension/commit/aab0e03a1a2aa71a9314df60b40e14f093c61250))
* **web:** fix i18n reactivity for web ([256ca34](https://github.com/dvcol/trakt-extension/commit/256ca345985342f7bc80930f23923d6e4573de86))
* **web:** fix local url fetching ([02036af](https://github.com/dvcol/trakt-extension/commit/02036afb5dfdc96bd83506b2c0cd14a478e255c1))
* **web:** remove trailing slash from redirect uri ([ddb1717](https://github.com/dvcol/trakt-extension/commit/ddb1717f4a314cdb2fc00c53ee1420eff20cc1dd))
* **web:** skip if doesn't start with basename ([91989be](https://github.com/dvcol/trakt-extension/commit/91989bea818a60044498c95166549720a129513a))

## [1.2.0](https://github.com/dvcol/trakt-extension/compare/v1.1.3...v1.2.0) (2023-08-26)


### Features

* **setup:** fix style encapsulation and remove vuetify ([9c03d87](https://github.com/dvcol/trakt-extension/commit/9c03d872a4e58ec5286301271ae3e962d1302ff9))


### Bug Fixes

* **wc:** fix typing, locale fetch and backgrounds ([41f35f8](https://github.com/dvcol/trakt-extension/commit/41f35f8244abbcb1815b11e472993e033ba03f95))

### [1.1.3](https://github.com/dvcol/trakt-extension/compare/v1.1.2...v1.1.3) (2023-08-25)


### Bug Fixes

* **router:** fix routing ([f624e1e](https://github.com/dvcol/trakt-extension/commit/f624e1ed225b4a8a33acec8b436552800fe569e8))

### [1.1.2](https://github.com/dvcol/trakt-extension/compare/v1.1.1...v1.1.2) (2023-08-25)


### Bug Fixes

* **routing:** adds basename ([83c4525](https://github.com/dvcol/trakt-extension/commit/83c45252409506d8c9be6627a1f5ad4359ad03df))
* **wc:** change base path ([b1793a9](https://github.com/dvcol/trakt-extension/commit/b1793a9047a0de75567be8aa672002940318c617))
* **wc:** disable export minification ([947fb44](https://github.com/dvcol/trakt-extension/commit/947fb4497ab34a1cf0e4927bd87c9f1c187b5d59))

### [1.1.1](https://github.com/dvcol/trakt-extension/compare/v1.1.0...v1.1.1) (2023-08-24)


### Bug Fixes

* **ci:** fix publish version ([cd99939](https://github.com/dvcol/trakt-extension/commit/cd99939ab6f4915e219be39f8154eb8c84215ce6))

## 1.1.0 (2023-08-24)


### Features

* **assets:** adds basic traktv assets ([c8e8e0c](https://github.com/dvcol/trakt-extension/commit/c8e8e0ccf06d7579cfdf1c0fda97d8e0bf77059d))
* **ci:** adds github release, npm publish and store upload ([10b9b99](https://github.com/dvcol/trakt-extension/commit/10b9b993aff71807853552a7182a983e52a526cb))
* **i18n:** adds local support ([3524f7d](https://github.com/dvcol/trakt-extension/commit/3524f7d0587bf5e06c34c4cadc83a0691b9145f4))
* **init:** initialized vite vue3 project ([75db580](https://github.com/dvcol/trakt-extension/commit/75db580789fc871edba3c0565966b774a59475b0))
* **vuetify:** adds vuetify setup ([c0edfca](https://github.com/dvcol/trakt-extension/commit/c0edfcab02e03ea77c6baaebfdba4a8f54b08e21))
* **wc:** add support for web component ([c641983](https://github.com/dvcol/trakt-extension/commit/c641983ec4a627a102b924b5f075fe81f0f11129))


### Bug Fixes

* **build:** fix hmr and add service worker ([7fd35a4](https://github.com/dvcol/trakt-extension/commit/7fd35a4dd71e07e39a481f2bb032dbbe723bf092))
* **ci:** fix npm publish config ([0c2a6c2](https://github.com/dvcol/trakt-extension/commit/0c2a6c24139a8d4494e92f81329dc60d0b199ba8))
* **ci:** remove yarn reference ([f32a5d4](https://github.com/dvcol/trakt-extension/commit/f32a5d40cbcdc3cfe3b1dec3c5993affd897877b))
* **lint:** fix stylelint and eslint ([af2aa03](https://github.com/dvcol/trakt-extension/commit/af2aa03f28f07a6bc6a0d768381dc2ad6d78706b))
* **wc:** sizing ([7240154](https://github.com/dvcol/trakt-extension/commit/724015488d31d005524ffe9e70a7c4a577339d8a))

## 1.0.0 (2023-08-24)