# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.26.2](https://github.com/dvcol/trakt-extension/compare/v1.26.1...v1.26.2) (2024-09-24)


### Bug Fixes

* **calendar:** only persist calendar date when set ([f90020b](https://github.com/dvcol/trakt-extension/commit/f90020bd76289c00cebf9621d06357b65b285f43))
* **checkin:** adds ellipsis and disable wrap ([d4c4266](https://github.com/dvcol/trakt-extension/commit/d4c42664d4a908d88d0adf666681b4cd706fd3a6))
* **css:** adjust stats value min-width ([b6dae1d](https://github.com/dvcol/trakt-extension/commit/b6dae1d4e1b509614bba4d9a08563cbe8250c91c))
* **css:** fix background flash on start ([963951e](https://github.com/dvcol/trakt-extension/commit/963951ee53357356da7845bc93cb09f14e1af106))
* **css:** remove margin from main list container ([617a2b1](https://github.com/dvcol/trakt-extension/commit/617a2b1ed191638b538b864c71bafbf97654f8d3))
* **export:** fix filename date config ([230d1dc](https://github.com/dvcol/trakt-extension/commit/230d1dcce6831c47c6ab31a3908b6dcbd07a666d))
* **list:** adds loaded indicator and fix load more ([ca47fc7](https://github.com/dvcol/trakt-extension/commit/ca47fc764f9d3b54c7f8902362e406e67bffddfd))
* **list:** restore scroll-top if loading with offset ([b9f7118](https://github.com/dvcol/trakt-extension/commit/b9f7118b2d9fb34b17cf792911c9246cc0252d82))
* **list:** switch correct i18n for pages & items ([8787195](https://github.com/dvcol/trakt-extension/commit/8787195b5631b3020582f268b769644a06c72350))
* **loading:** increase loading debounce and adjust date loader ([3235dca](https://github.com/dvcol/trakt-extension/commit/3235dca081c1632dda15607d0450c9e270825687))
* **loading:** make loading hysteresis customisable ([93669c6](https://github.com/dvcol/trakt-extension/commit/93669c6e71717b25ba9a5620771be4afb4f66b7f))
* **pagination:** switch type and fix reactivity ([5852e8c](https://github.com/dvcol/trakt-extension/commit/5852e8c41dfe8cd34c040fde55042958c838570b))
* **polling:** disable polling when document is not visible ([b02e141](https://github.com/dvcol/trakt-extension/commit/b02e1412de9de8aae6997a6d12ca8f6ac886d1d3))
* **visibility:** watch document visibility and refresh view when active ([a5345dc](https://github.com/dvcol/trakt-extension/commit/a5345dcb39d44a31dff0d680ad55a07462c23690))

### [1.26.1](https://github.com/dvcol/trakt-extension/compare/v1.26.0...v1.26.1) (2024-09-10)


### Bug Fixes

* **simkl:** adds simkl links to movies ([1ee6a04](https://github.com/dvcol/trakt-extension/commit/1ee6a0444546f16e307ba6aea5ae8d38f9c2cdda))

## [1.26.0](https://github.com/dvcol/trakt-extension/compare/v1.25.3...v1.26.0) (2024-09-10)


### Features

* **settings:** adds custom background colour option ([725015c](https://github.com/dvcol/trakt-extension/commit/725015cb47a024433a895c629ecf53d90f8a380e))
* **web:** adds support for swipe to close panel ([2a1b704](https://github.com/dvcol/trakt-extension/commit/2a1b704ce157b38eb369bbe85f49a5fc1620a405))
* **web:** adds swipe support to panel carousel ([9da0b7e](https://github.com/dvcol/trakt-extension/commit/9da0b7ebb5e41346799fabe4979b142884f76674))
* **web:** adds touch support ([2be1cc3](https://github.com/dvcol/trakt-extension/commit/2be1cc357252fd4e341ef54cb89287bf08d6d61e))
* **web:** adds touch swipe support for header ([74256ee](https://github.com/dvcol/trakt-extension/commit/74256eea8f039110a19a5fcdf392fa8cdf5619b5))


### Bug Fixes

* **badge:** remove placeholders from badge count ([0e9a03c](https://github.com/dvcol/trakt-extension/commit/0e9a03c8f45a6e1ccd9f191db6716cf37a133991))
* **css:** disable overscroll in panels ([eb12bcf](https://github.com/dvcol/trakt-extension/commit/eb12bcf2b76067807378e2dfc6261df54a24246c))
* **loading:** adjust tag loader css ([101a154](https://github.com/dvcol/trakt-extension/commit/101a154a8c44ba365c72de7e8b35cae2817b0e5b))
* **loading:** improve list loading indicator ([f4427ca](https://github.com/dvcol/trakt-extension/commit/f4427ca284486959d3d31a5c20c642c97e3cdb79))
* **notification:** only notify on major version update ([74e68bc](https://github.com/dvcol/trakt-extension/commit/74e68bc4e4a54f518c740a40edd6682f993cc957))
* **pwa:** adds bottom inset to footer ([dcc2be7](https://github.com/dvcol/trakt-extension/commit/dcc2be73b31555781bcb0444903716d86e0b5883))
* **pwa:** adjust height of watching indicator & fix i18n label ([ce14823](https://github.com/dvcol/trakt-extension/commit/ce148232e646b7492ad6fb44d5e0f7b44b9ffc1a))
* **pwa:** switch to absolute viewport unit in standalone mode ([c67c380](https://github.com/dvcol/trakt-extension/commit/c67c38049eb595f9b8705c07ab164229117dc32f))
* **scroll:** use framework scroller handler ([42fe03c](https://github.com/dvcol/trakt-extension/commit/42fe03c23abbc40e0748fbf022d17634d13ab0de))
* **web:** fix checkin safe inset area padding ([c40e441](https://github.com/dvcol/trakt-extension/commit/c40e441167c0ec6ac81761816fa2c99bdf5ca7ef))
* **web:** handle scrollable drawer in swipe actions ([125b740](https://github.com/dvcol/trakt-extension/commit/125b740224067b18511a7da807549925e9600bff))
* **web:** invert swipe direction for navbar ([13d847b](https://github.com/dvcol/trakt-extension/commit/13d847b407898d9034294c6e93eda81dcf4a5de0))

### [1.25.3](https://github.com/dvcol/trakt-extension/compare/v1.25.2...v1.25.3) (2024-09-05)


### Bug Fixes

* **list-scroll:** supports scroll boundary ([5e72b36](https://github.com/dvcol/trakt-extension/commit/5e72b3606b1d367461636d386e236165d926ed42))
* **loading:** add minimum height to settings loader ([15a9f1e](https://github.com/dvcol/trakt-extension/commit/15a9f1e8a4f0e3fac451171b0f005b96b51f9bee))
* **loading:** only offset placeholder if passed timeout ([c24c8ac](https://github.com/dvcol/trakt-extension/commit/c24c8acb8f485918f10a5aa960586084043581a5))

### [1.25.2](https://github.com/dvcol/trakt-extension/compare/v1.25.1...v1.25.2) (2024-09-05)


### Bug Fixes

* **activity:** prevent duplicate calls ([512c3ef](https://github.com/dvcol/trakt-extension/commit/512c3ef8ef7d2ded009dcdc5c0c86654cca231e8))
* **css:** fix loading skeleton width on small screens ([546d8f1](https://github.com/dvcol/trakt-extension/commit/546d8f189c8c74982bb5220d1641077247895e2d))
* **i18n:** prevent infinite hmr loop ([3330adb](https://github.com/dvcol/trakt-extension/commit/3330adb8ff9a7fdc4f66ee1f9749d10b5ddb3937))
* **loading:** fix calendar loading indicator ([4979193](https://github.com/dvcol/trakt-extension/commit/49791930db0151e70345510a9130ac71707946ab))
* **polling:** increase default polling ([0ffb8ae](https://github.com/dvcol/trakt-extension/commit/0ffb8ae13e56bce721f56db58092b70b91e0c38b))
* **pwa:** disable pinch to zoom in pwa mode ([0696c57](https://github.com/dvcol/trakt-extension/commit/0696c57213b4f6c17df1f27c7d4a113498526d84))
* **responsive:** handle compact screen sizes ([ac01921](https://github.com/dvcol/trakt-extension/commit/ac019214c304e4813a40c0ad4473bc4655ed029b))
* **scroll:** disable over-scroll on virtual list ([0b5f1a0](https://github.com/dvcol/trakt-extension/commit/0b5f1a0965244095dc2c5264013a8bf49d15928d))
* **scroll:** parametrize overscroll ([0238c60](https://github.com/dvcol/trakt-extension/commit/0238c60549086f30885b107d1f8b90be10b5629c))
* **web:** constrain scalability but allow it ([f915df9](https://github.com/dvcol/trakt-extension/commit/f915df949ae7b485b87f5032fdac14238bcbf104))

### [1.25.1](https://github.com/dvcol/trakt-extension/compare/v1.25.0...v1.25.1) (2024-09-04)


### Bug Fixes

* **navbar:** adjust avatar fallback css ([cb57d4d](https://github.com/dvcol/trakt-extension/commit/cb57d4d2d4bebf37151c3adecc0af3dc0de52be9))
* **release:** await region loading when loading releases ([b172331](https://github.com/dvcol/trakt-extension/commit/b172331ca4c9b60c72417bb88b6c9171929710fd))

## [1.25.0](https://github.com/dvcol/trakt-extension/compare/v1.24.4...v1.25.0) (2024-09-03)


### Features

* **links:** adds export/import mechanism ([115848c](https://github.com/dvcol/trakt-extension/commit/115848c69cc8f10f0519b65c568191a461073fa6))


### Bug Fixes

* **cache:** default storage area to custom local ([af71738](https://github.com/dvcol/trakt-extension/commit/af71738da9e9d9d91f103cf3ae5e20ec2c8a89c4))
* **css:** fix reactive view for small screens ([e80d937](https://github.com/dvcol/trakt-extension/commit/e80d937df4145f35a0ba81d30fcd6bc6f04a2449))
* **navbar:** fix responsive css for date picker date-range mode ([b69276a](https://github.com/dvcol/trakt-extension/commit/b69276ac2f29b248624f356903fc4a688bc1b9f2))
* **navbar:** resize avatar img to fit in navbar ([0c6b1e4](https://github.com/dvcol/trakt-extension/commit/0c6b1e4a1c5f8b05df2705f71f0af6f8a2631aa0))
* **shell:** adds loading indicator delay to shell skeleton ([6d65a6c](https://github.com/dvcol/trakt-extension/commit/6d65a6c97102dfa5c124d7ef89ffee518b3b6592))
* **web:** adds hardcoded background-color to prevent flashing ([0796f36](https://github.com/dvcol/trakt-extension/commit/0796f36756c3d37a64f24b19670f09716a9828a4))

### [1.24.4](https://github.com/dvcol/trakt-extension/compare/v1.24.3...v1.24.4) (2024-08-30)


### Bug Fixes

* **panel:** adjust css to make active episode more visible ([d7245af](https://github.com/dvcol/trakt-extension/commit/d7245af928411a45d409d505d2e9c9ed54fdd884))
* **pwa:** add offset to list-scroll padding ([881749f](https://github.com/dvcol/trakt-extension/commit/881749f26be3eee3105dbde522ecb9dcded71115))
* **pwa:** adds transparency to status bar ([94687af](https://github.com/dvcol/trakt-extension/commit/94687af08928df33fdde8bba3b2beb0b9353a0c3))
* **pwa:** force service worker auto-update ([0c647a7](https://github.com/dvcol/trakt-extension/commit/0c647a7bca7ab12d4d94e95dccf9dc4d6b19d486))
* **pwa:** update header offset ([421fcf5](https://github.com/dvcol/trakt-extension/commit/421fcf5e42a515e203d50e93a36663cb7ff38978))

### [1.24.3](https://github.com/dvcol/trakt-extension/compare/v1.24.2...v1.24.3) (2024-08-29)


### Bug Fixes

* **login:** adjust styles to keep loading indicator placement consistent ([38681cf](https://github.com/dvcol/trakt-extension/commit/38681cff05c75a874330f8dfaa279a2a9bf52e3a))
* **login:** open code verification in separate tab ([25f422c](https://github.com/dvcol/trakt-extension/commit/25f422cc26582e9f4fb9f7f4082ce3da6ab80904))
* **navbar:** adjust transparency of the active capsule ([e7cf0d0](https://github.com/dvcol/trakt-extension/commit/e7cf0d0cb41de1ec0e3c9a5832769d7ec3a5eeb1))

### [1.24.2](https://github.com/dvcol/trakt-extension/compare/v1.24.1...v1.24.2) (2024-08-27)


### Bug Fixes

* **panel:** adds transition to prevent watched/collected flicker ([9fb2b8e](https://github.com/dvcol/trakt-extension/commit/9fb2b8e8d0ffd091b8d34ee7863c6c3f125e3550))

### [1.24.1](https://github.com/dvcol/trakt-extension/compare/v1.24.0...v1.24.1) (2024-08-27)


### Bug Fixes

* **storage:** await set in wrapper to better handler errors ([3e81ce8](https://github.com/dvcol/trakt-extension/commit/3e81ce8b76e356cd54f06a49a062c23d8b4d35cb))

## [1.24.0](https://github.com/dvcol/trakt-extension/compare/v1.23.1...v1.24.0) (2024-08-26)


### Features

* **cache:** clean stale cache on init ([e09d9c7](https://github.com/dvcol/trakt-extension/commit/e09d9c7f38628986b714ebbb524ab9f2c3c33311))


### Bug Fixes

* **cache:** evict user cache on logout ([15bdfd8](https://github.com/dvcol/trakt-extension/commit/15bdfd8f63c3a32cef1a0f2a41e7350a3aae9f26))
* **cache:** logs eviction date by default ([0272c60](https://github.com/dvcol/trakt-extension/commit/0272c601eda0d0602c0d8063a2b3859a4b025803))
* **loader:** adds full height loader in option & web ([0556716](https://github.com/dvcol/trakt-extension/commit/055671677a36aa6de1e539eb3e5145df161298ad))
* **login:** show component on activated instead of mounted ([e7aa62a](https://github.com/dvcol/trakt-extension/commit/e7aa62a279c82b7de341995df49e06862fdc1de8))
* **statistics:** update show ratings on mounted instead of computed ([7e06f4e](https://github.com/dvcol/trakt-extension/commit/7e06f4ee0957b58b3f2143999cff641289d34236))

### [1.23.1](https://github.com/dvcol/trakt-extension/compare/v1.23.0...v1.23.1) (2024-08-24)


### Bug Fixes

* **activity:** add null check to prevent error ([86c27f5](https://github.com/dvcol/trakt-extension/commit/86c27f59559ebf269c5e33d8c9a662676c4a5bfe))

## [1.23.0](https://github.com/dvcol/trakt-extension/compare/v1.22.0...v1.23.0) (2024-08-23)


### Features

* **list:** adds show link for list items ([a8c43d0](https://github.com/dvcol/trakt-extension/commit/a8c43d08a0aaa85df87656b5213f1f68d82b1ce2))
* **panel:** adds external links & studio support ([d109336](https://github.com/dvcol/trakt-extension/commit/d109336af925dfd79df9c7d91f5f87af66f79a94))
* **panel:** adds multi rating support & rework linking ([55dfa9f](https://github.com/dvcol/trakt-extension/commit/55dfa9f370a3fed31af3fa7bae038a8fb941fc84))
* **panel:** adds trailer support ([191946c](https://github.com/dvcol/trakt-extension/commit/191946c6f4e5043fb24930052f0896fb0380cf80))
* **rating:** adds url to external ratings ([fd8e3e3](https://github.com/dvcol/trakt-extension/commit/fd8e3e3141102c00eb6f3ab6a8df8845bf129ab0))
* **settings:** adds stats in settings ([95e4054](https://github.com/dvcol/trakt-extension/commit/95e40543431ca724dfa31539c1c530477499327d))
* **simkl:** add simkl ratings for show & movies ([58aeddb](https://github.com/dvcol/trakt-extension/commit/58aeddb66c1f52bf0c307404281c3caa997ec8d6))
* **simkl:** adds toggle ([bbe1c13](https://github.com/dvcol/trakt-extension/commit/bbe1c133ae74b1a00d6ee0284b5908cfbbfa3942))
* **simkl:** big rework of account management & adding simkl auth ([5bd3253](https://github.com/dvcol/trakt-extension/commit/5bd3253e19d984dc395a04740f450d2b8fd7387b))


### Bug Fixes

* **badge:** check if user is authenticated before sending update ([1c28d52](https://github.com/dvcol/trakt-extension/commit/1c28d5297d19d023e2df5dca959dea6d8a1c24f8))
* **ci:** adds api keys for simkl ([4cbea70](https://github.com/dvcol/trakt-extension/commit/4cbea708d50ce78f0e0e9cc0d78957efcc16f40d))
* **common:** adds loading prop to text-fields and change default align ([6db6954](https://github.com/dvcol/trakt-extension/commit/6db695451ab0b3b519a1ac599e0cff7158359682))
* **common:** update textfield css ([ebbeacd](https://github.com/dvcol/trakt-extension/commit/ebbeacdd6c41b9a3a1993f9029f35d7f597d8566))
* **css:** make panels and buttons more responsive ([8bbf577](https://github.com/dvcol/trakt-extension/commit/8bbf577f862b090a6a506ea2c7fc2433d8657771))
* **css:** update hover and focus to make the ui more accessible ([19c0e6a](https://github.com/dvcol/trakt-extension/commit/19c0e6a235a7a504cc15bbe90b5a834d19c56be4))
* **list:** pause list render on panel open to prevent flicker ([ce7cd14](https://github.com/dvcol/trakt-extension/commit/ce7cd14efeaee9cb8e7667b3b137d268f74b9b61))
* **loading:** rework util to make it composable ([666b14b](https://github.com/dvcol/trakt-extension/commit/666b14b3b62912d4c7002275a2b6502e5258fa10))
* **progress:** fix error on click and rework keyboard inputs ([06e1c7a](https://github.com/dvcol/trakt-extension/commit/06e1c7aa36f1bba54e3975da7f1bb556b6e58dad))
* **settings:** skip loading when persisting cache ([67b4361](https://github.com/dvcol/trakt-extension/commit/67b4361c5b1d3360d3cd0446b459f54a43716034))
* **settings:** update css to make settings responsive ([f371952](https://github.com/dvcol/trakt-extension/commit/f371952d1a57339a2ad279054ab51d1c519477d1))
* **simkl:** correctly assign simkl account to user ([a43ed3d](https://github.com/dvcol/trakt-extension/commit/a43ed3d85655df0068a59eb88c183815ec88c403))
* **simkl:** correctly return simkl enabled based on active user ([422c374](https://github.com/dvcol/trakt-extension/commit/422c374274758ab0594012d8e8f7a12c60409173))
* **simkl:** update api and fix toggle ([c552b6f](https://github.com/dvcol/trakt-extension/commit/c552b6fac0abfe0b4b230df5233a62f2df8fbe17))
* **web:** disable simkl for web ([1e7611c](https://github.com/dvcol/trakt-extension/commit/1e7611cfe481059bad4bc1fecf15305711c70a30))

## [1.22.0](https://github.com/dvcol/trakt-extension/compare/v1.21.0...v1.22.0) (2024-08-13)


### Features

* **history:** adds settings to load history on startup ([c4c2268](https://github.com/dvcol/trakt-extension/commit/c4c226865105d474b8f2bb965178b45f1a25a639))
* **list:** adds collected & watched date on hover ([02cd3d3](https://github.com/dvcol/trakt-extension/commit/02cd3d32258a0e870ec6903642a88fc37808fafc))
* **list:** source played status from history when no progress available ([88429b2](https://github.com/dvcol/trakt-extension/commit/88429b21b0cb3f46a5f055c722388e0429626277))


### Bug Fixes

* **api:** fix redirect url on web ([4c8346e](https://github.com/dvcol/trakt-extension/commit/4c8346e9e2f2482d564e34179d1a7a85c68e26b2))
* **badge:** do not fetch when not authenticated ([6152459](https://github.com/dvcol/trakt-extension/commit/61524591d06a98c2577ab63b2025862d4b3efbd5))
* **list:** only trigger updated when view is active ([e25e06c](https://github.com/dvcol/trakt-extension/commit/e25e06c1c01566866decf1dd043a4d0d2744c8b7))
* **login:** login in place on web ([1f86a90](https://github.com/dvcol/trakt-extension/commit/1f86a90d3789706a002dea06619ae3fbcf254fc6))
* **proxy:** refactor cached progress and handle proxy on web ([0345b34](https://github.com/dvcol/trakt-extension/commit/0345b34fdab247b37000c498ae09a942cd9c47bd))
* **proxy:** update proxy prefix ([19f28cc](https://github.com/dvcol/trakt-extension/commit/19f28cc86bee8a65976a8ff849b79174c321e94a))
* **router:** make progress inaccessible from web ([d2c8f5a](https://github.com/dvcol/trakt-extension/commit/d2c8f5a8791802c153ea5e8086b9103cc5c021c5))
* **web:** fix unsafe store access in use-list-scroll ([b1875cb](https://github.com/dvcol/trakt-extension/commit/b1875cb416bbc8031d0d11b09cbd7cc17a90f9bd))

## [1.21.0](https://github.com/dvcol/trakt-extension/compare/v1.20.0...v1.21.0) (2024-08-10)


### Features

* **badge:** adds support for progress badge ([ec9a58b](https://github.com/dvcol/trakt-extension/commit/ec9a58b6ab8125608d30be92429a6fecec5fe670))


### Bug Fixes

* **calendar:** correctly space days when 1 or 2 results only ([06fb538](https://github.com/dvcol/trakt-extension/commit/06fb5383eace999dafdf8fd21ef747c50a42046f))

## [1.20.0](https://github.com/dvcol/trakt-extension/compare/v1.19.0...v1.20.0) (2024-08-10)


### Features

* **activity:** adds activity polling and fix watching polling ([3dd58e8](https://github.com/dvcol/trakt-extension/commit/3dd58e870567ac6343ffebe1b715a8f696fb766f))
* **badge:** adds calendar badge summary ([6f6112f](https://github.com/dvcol/trakt-extension/commit/6f6112f322fd8ad5976910244a1110fa178f30e7))
* **progress:** adds mismatch warning and improve stale data detection ([dc8ac91](https://github.com/dvcol/trakt-extension/commit/dc8ac9195c101812b9aad450273608bb3237a0be))
* **release:** adds release note notification on update ([4e69561](https://github.com/dvcol/trakt-extension/commit/4e6956171b15224b0eb0282920d5935029e32009))


### Bug Fixes

* **app:** fix overflow flashing scrollbar on panel opening ([09363cc](https://github.com/dvcol/trakt-extension/commit/09363ccca3b5fe5e78b36d63b271e47d0d6a27aa))
* **badge:** uses local date to detect today instead of UTC ([7b486a2](https://github.com/dvcol/trakt-extension/commit/7b486a2ea6ba7ec07137e9bb9f8beea2c3cefed3))
* **checkin:** refresh progress and calendar view on checkin event ([ab64adc](https://github.com/dvcol/trakt-extension/commit/ab64adcad6a19bbeb74ccc52d0aebef74b46c12e))
* **pagination:** creates constant and fix settings page sizes ([df26938](https://github.com/dvcol/trakt-extension/commit/df26938986a275d190a369235227877c78079a8c))
* **settings:** disable badge for the web version ([d11d457](https://github.com/dvcol/trakt-extension/commit/d11d45793d9fdb35d212332fb849900432eb3a50))
* **store:** set on pageSize undefined instead of truthy (to include 0) ([61ff5c0](https://github.com/dvcol/trakt-extension/commit/61ff5c0c1aaec75f1c0ab4b67b090508f27d72e0))
* **test:** rework import to allow mocking ([719af6e](https://github.com/dvcol/trakt-extension/commit/719af6e8a1a558969187fa8f0b2763dfddaa5fe3))
* **user:** remove typo in restaure user list hook ([5314c05](https://github.com/dvcol/trakt-extension/commit/5314c05f7e8bfd4ae9720546f126bf3c8b187d35))
* **web:** early abort sendMessage and fix invalid auth ([58c7426](https://github.com/dvcol/trakt-extension/commit/58c7426b4fb078c9add659b66984a508f50b2cad))

## [1.19.0](https://github.com/dvcol/trakt-extension/compare/v1.18.3...v1.19.0) (2024-08-04)


### Features

* **logger:** rework logger service & bump common utils ([dc7dbb4](https://github.com/dvcol/trakt-extension/commit/dc7dbb4b49555ea3dca3afe0028187bafd5bca92))

### [1.18.3](https://github.com/dvcol/trakt-extension/compare/v1.18.2...v1.18.3) (2024-08-03)


### Bug Fixes

* **login:** fix blank header in login page ([7129f7a](https://github.com/dvcol/trakt-extension/commit/7129f7a02b89d328f9ed75e72b2180e13d2a4d0a))
* **login:** fix progress indicator and add polling indicator ([0f20096](https://github.com/dvcol/trakt-extension/commit/0f20096600ace60556b4e7a255b71c46356735a3))
* **login:** improve border css on code login ([1ea6dfc](https://github.com/dvcol/trakt-extension/commit/1ea6dfcb583de354c1704fd44f6272e88f561de8))
* **panel:** refactor and fix background progress transition ([e2f6e3f](https://github.com/dvcol/trakt-extension/commit/e2f6e3ff5d5b67e2080984412fca80bd8082b5dd))

### [1.18.2](https://github.com/dvcol/trakt-extension/compare/v1.18.1...v1.18.2) (2024-08-02)


### Bug Fixes

* **panel:** fix links overflow issues on small screen ([b4cfb8e](https://github.com/dvcol/trakt-extension/commit/b4cfb8ed1b51c6825d89bb9966c19d2c7e61cac9))
* **panel:** rework wording and fix overflow issues ([cd8b54c](https://github.com/dvcol/trakt-extension/commit/cd8b54cdc9c1b6439925d60a10d6cd3779ff8c51))
* **rating:** adds support for touch targets ([43fd32c](https://github.com/dvcol/trakt-extension/commit/43fd32c81e962e6755c338a6da67184ea1a0b219))

### [1.18.1](https://github.com/dvcol/trakt-extension/compare/v1.18.0...v1.18.1) (2024-08-01)


### Bug Fixes

* **ratings:** fix css responsive flow on screen <= 725px ([6c4f013](https://github.com/dvcol/trakt-extension/commit/6c4f01339ccad3699a168b1b4e3814dc06e416e8))

## [1.18.0](https://github.com/dvcol/trakt-extension/compare/v1.17.1...v1.18.0) (2024-08-01)


### Features

* **panel:** adds ratings to movie & show panels ([061153d](https://github.com/dvcol/trakt-extension/commit/061153d480ef729132749d53316cc6e5c3db4126))
* **rating:** refactor and add loading & link handling ([b7da524](https://github.com/dvcol/trakt-extension/commit/b7da5240b26202bc7f8ea9a710382b49efca9e83))
* **ratings:** adds rating addition & removal in store ([0c9f95c](https://github.com/dvcol/trakt-extension/commit/0c9f95cdef90f2007c520094710578c448ec6360))
* **ratings:** adds rating edition mode ([a14e06d](https://github.com/dvcol/trakt-extension/commit/a14e06d1b5e145a46aa60d868ba753b0b0547bd4))
* **ratings:** adds score & review options ([c296dca](https://github.com/dvcol/trakt-extension/commit/c296dcaab533d94eb783d1a2ebeeac88c71436e1))


### Bug Fixes

* **color:** rename info-color to color-info ([60fe888](https://github.com/dvcol/trakt-extension/commit/60fe88819db1b0b8a747177210a0c41a0ce08a00))

### [1.17.1](https://github.com/dvcol/trakt-extension/compare/v1.17.0...v1.17.1) (2024-07-27)


### Bug Fixes

* **i18n:** rephrasing page warning ([101ee1e](https://github.com/dvcol/trakt-extension/commit/101ee1e9abef99d242f540787f668f74c9cb0b12))
* **storage:** handle variable quota size errors ([db0a60d](https://github.com/dvcol/trakt-extension/commit/db0a60d421cfecc73b4b3bbaaa98644cae2686e9))

## [1.17.0](https://github.com/dvcol/trakt-extension/compare/v1.16.0...v1.17.0) (2024-07-26)


### Features

* **panel:** move panel state to app store & support dirty state ([c6e5c01](https://github.com/dvcol/trakt-extension/commit/c6e5c01fb3b6747d4cc3f44e34791eb3008e5191))
* **progress:** adds collection & watched badge, adds eager data fetch ([5fab4b1](https://github.com/dvcol/trakt-extension/commit/5fab4b1936eb73979363f36550363ef501e167d5))

## [1.16.0](https://github.com/dvcol/trakt-extension/compare/v1.15.0...v1.16.0) (2024-07-18)


### Features

* **checkin:** add checkin button in panels ([d370168](https://github.com/dvcol/trakt-extension/commit/d370168bf5e276811775dc07f58d9f46b4638d72))
* **checkin:** create now watching bar component ([15730c9](https://github.com/dvcol/trakt-extension/commit/15730c906986eceebea9c66ff59f1dfcb1de50d7))
* **checkin:** implement checkin button & progress state evict ([08f2705](https://github.com/dvcol/trakt-extension/commit/08f27055425c142dc008589516f99a1a9ab1d259))
* **checkin:** open panels on checkin click ([f23eee1](https://github.com/dvcol/trakt-extension/commit/f23eee1c3eef89d55496632a5f8d696e3fe043aa))
* **settings:** adds watching settings ([35d2e3d](https://github.com/dvcol/trakt-extension/commit/35d2e3db89577999832c1f77b80be590a61da4c9))
* **web:** parametrise full-height to allow override ([1341e93](https://github.com/dvcol/trakt-extension/commit/1341e93de5b36423ad371cf81cd08dc614a5d73a))


### Bug Fixes

* **html:** adds overscroll behaviour to prevent bouncing ([69e5986](https://github.com/dvcol/trakt-extension/commit/69e5986a1916a9b39ea001b984b5231f91ded830))
* **watching:** adds auth check before polling ([9e0baf6](https://github.com/dvcol/trakt-extension/commit/9e0baf6af86d02da40a0f4028dd3393b3c8ee1ea))

## [1.15.0](https://github.com/dvcol/trakt-extension/compare/v1.14.0...v1.15.0) (2024-07-16)


### Features

* **auth:** adds device code polling support ([ea2a2ba](https://github.com/dvcol/trakt-extension/commit/ea2a2ba637f925da680d93880700a1b1a572b9a7))
* **pwa:** adds basic service worker ([3c47116](https://github.com/dvcol/trakt-extension/commit/3c47116de47535fa24a9bb4944d0e575a2c77a77))

## [1.14.0](https://github.com/dvcol/trakt-extension/compare/v1.13.0...v1.14.0) (2024-07-15)


### Features

* **calendar:** re-factor composables ([8cdcaac](https://github.com/dvcol/trakt-extension/commit/8cdcaacbed7d67b59c416cb965751ebc97478e59))
* **export:** add support for data exporting ([99e6a99](https://github.com/dvcol/trakt-extension/commit/99e6a99bcda048f41eadc30136f0bd752157eb22))
* **releases:** adds navbar support to releases ([e8206ed](https://github.com/dvcol/trakt-extension/commit/e8206ed8db15042a607e1088b0c7e945e8fa9304))
* **release:** setup release fetching ([b37f9a4](https://github.com/dvcol/trakt-extension/commit/b37f9a4464e4fcd6ebd9a8c050def119c91a5c07))


### Bug Fixes

* **navbar:** adjust dropdown size based on active tabs ([b74e53f](https://github.com/dvcol/trakt-extension/commit/b74e53ffe6c49161cb304a94b23f4f05b3dd1875))
* **release:** defaults back to locale when no region selected ([922b156](https://github.com/dvcol/trakt-extension/commit/922b156f54127e19ddc257382c5d49ae73454ca2))

## [1.13.0](https://github.com/dvcol/trakt-extension/compare/v1.12.0...v1.13.0) (2024-07-09)


### Features

* **(panel:** fade un-aired episodes & seasons in show panel ([f3ba370](https://github.com/dvcol/trakt-extension/commit/f3ba370db252de06cd170e85bef220968fe5ab1d))
* **progress:** allows display of progress for season instead of shows ([4b8eabb](https://github.com/dvcol/trakt-extension/commit/4b8eabb95bc17e5d489f2e64519174b925642fc1))

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