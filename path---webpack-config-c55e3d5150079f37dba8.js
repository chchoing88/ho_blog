webpackJsonp([0xa14eb2634ca9],{521:function(n,s){n.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/webpack-config/index.md absPath of file >>> MarkdownRemark",html:'<h2>Intro</h2>\n<hr>\n<ul>\n<li>기존에 돌아가는 서버를 바라보는 dev proxy server를 띄워 부분적으로 react component를 개발하는 환경을 만들어보자.</li>\n<li>그러기 위해서 사용하는 개발서버 webpack dev config 설정을 해보자.</li>\n<li>배포를 위한 webpack prod config 설정을 해보자.</li>\n<li>webpack 개발을 위한 babel , react-hot-loader 등을 설정해보자.</li>\n<li>webpack 을 node api 로 사용해보자.</li>\n</ul>\n<h2>Tech stack</h2>\n<hr>\n<ul>\n<li>webpack v4.0</li>\n<li>react v16.2</li>\n</ul>\n<h2>Structure</h2>\n<hr>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>├── config\n│   ├── paths                       ## 경로 설정 ( 각자의 경로가 다르다면 여기서 수정)\n│   ├── webpack.prod.config.js      ## 웹팩 prod config\n│   ├── webpack.dev.config.js       ## 웹팩 dev config\n│   ├── wepackDevServer.js          ## 웹팩 dev server용 config\n├── scripts                         ## frontend 개발서버 , build , 배포 쪽 스크립트\n│   ├── build.js                    ## 배포 build \n│   ├── start.js                    ## 개발서버 start \n├── src                             ## react 소스 폴더\n│   ├── components                  ## components 들 모음 폴더\n│   ├── App.js                      ## app 의 시작점\n│   ├── index.js                    ## react render의 시작점\n├── .babelrc\n├── package.json                    \n  </code></pre>\n      </div>\n<ul>\n<li>dev 환경 : script/start.js 에서 webpack.dev.config 와 webpackDevServer 를 import 하여 webpack dev server 를 실행시킨다. </li>\n<li>prod 환경 : script/build.js 에서 webpack.prod.config 를 이용해서 bundle.js를 만든다.</li>\n<li>공통 환경 : paths.js 경로에 관련된 환경</li>\n<li>깃 : <a href="https://github.kakaocorp.com/FTDev-RnD/study-docker/tree/master/merlin_app/merlin_frontend">https://github.kakaocorp.com/FTDev-RnD/study-docker/tree/master/merlin<em>app/merlin</em>frontend</a></li>\n</ul>\n<h2>각 파일 설명</h2>\n<hr>\n<h3>webpack.dev.config.js</h3>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> paths <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./paths"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"./src/index.js"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  output<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    path<span class="token punctuation">:</span> paths<span class="token punctuation">.</span>appPublic<span class="token punctuation">,</span>\n    filename<span class="token punctuation">:</span> <span class="token string">"bundle.js"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  devtool<span class="token punctuation">:</span> <span class="token string">"inline-source-map"</span><span class="token punctuation">,</span>\n  module<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    rules<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        test<span class="token punctuation">:</span> <span class="token regex">/\\.js$/</span><span class="token punctuation">,</span>\n        exclude<span class="token punctuation">:</span> <span class="token regex">/node_modules/</span><span class="token punctuation">,</span>\n        use<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n          loader<span class="token punctuation">:</span> <span class="token string">"babel-loader"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  mode<span class="token punctuation">:</span> <span class="token string">"development"</span><span class="token punctuation">,</span>\n  plugins<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  resolve<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    modules<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"node_modules"</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p><strong>webpack 4에는 production 과 development mode 옵션이 생겨났다.</strong></p>\n<p>보통의 경우 development config 파일과 production config 파일 2개를 관리하게 된다.</p>\n<ul>\n<li>webpack dev server 를 설정하고 기타 설정들을 위한 dev config</li>\n<li>UglifyJsPlugin , 소스맵 , 뿐만아니라 배포를 위한 최적화 된 bundle.js 를 위한 기타 설정들을 위한 prod config</li>\n</ul>\n<p>webpack 4 에선 —mode (production / development) 옵션으로 해당 옵션만으로 </p>\n<p>production 모드에선 minification과 hoisting , tree-shaking(불필요 한것을 떨군다.) 등등의 최적화 작업이 자동으로 이뤄지고\ndevelopment 모드에선 다른 방식으로 optimized를 하면서 un-minified bundle을 내뱉어 준다.</p>\n<p>mode 옵션에 대한 참고 : <a href="https://www.valentinog.com/blog/webpack-4-tutorial/#webpack_4_production_and_development_mode">https://www.valentinog.com/blog/webpack-4-tutorial/#webpack<em>4</em>production<em>and</em>development_mode</a></p>\n<h3>webpackDevServer</h3>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> noopServiceWorkerMiddleware <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"noop-service-worker-middleware"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token keyword">public</span><span class="token punctuation">:</span> <span class="token string">"nodeapp.local:3001"</span><span class="token punctuation">,</span>\n  inline<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// live reloading insert bundle..</span>\n  hot<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// hot module reloading</span>\n  compress<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// enable gzip compression</span>\n  historyApiFallback<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token function">before</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">//app.use(errorOverlayMiddleware());</span>\n    app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token function">noopServiceWorkerMiddleware</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  overlay<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    warnings<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    errors<span class="token punctuation">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>webpack dev server 에 대한 기본적인 option 부분이다.</p>\n<p><strong>devServer 의 옵션</strong></p>\n<ul>\n<li>devServer.public : dev server 의 inline 모드와 proxying dev server 이용시, inline client scrtip는 항상 어디에 연결해야 하는지 모른다. client script는 server에 window.location 기준으로 추축하게 된다. 그러나 이게 실패할시 이 public을 이용하게 된다.</li>\n<li>devServer.inline : dev server 에는 inline 모드와 hot 모드가 있다. default 는 inline 모드를 사용한다. 이것은 번들에 삽입되어서 live reloading을 지원하고 build 메세지를 브라우져 console에 보여준다.</li>\n<li>devServer.historyApiFallback : HTML5 History API 를 사용할때(즉, SPA사용시), true로 설정하면 어느 404 응답대신 index.html을 제공된다. rewrites(Object or Array)를 이용하면 by passing을 설정할 수 있다.</li>\n<li>devServer.contentBase : dev server 는 기존 프로젝트 루트에 있는 파일을 서비스 하는데 여기서는 proxy를 사용하기에 별도로 작성하지 않는다. </li>\n<li>devServer.before() : dev 서버 안에 모든 내부 미들웨전에 실행하는 부분이다. 이부분은 커스텀 핸들러를 정의하는데 사용할 수 있다.</li>\n<li>devServer.overlay : 컴파일 에러시 브라우져 화면에 overlay 로 보여준다.</li>\n</ul>\n<p><strong>noopServiceWorkerMiddleware</strong></p>\n<ul>\n<li>express의 미들웨어를 리턴하는 녀석으로 이전의 서비스 워커 설정들을 reset 시키는 녀석이다. ( 사실 react-create-app 에서 사용하기에 들고왔다. ) </li>\n<li>아직 왜 필요한지는 파악하지 못함.</li>\n<li>서비스 워커란? <a href="https://b.limminho.com/archives/1384">https://b.limminho.com/archives/1384</a></li>\n</ul>\n<h3>webpack.prod.config</h3>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> paths <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./paths"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"./src/index.js"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  output<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    path<span class="token punctuation">:</span> paths<span class="token punctuation">.</span>appPublic<span class="token punctuation">,</span>\n    filename<span class="token punctuation">:</span> <span class="token string">"bundle.js"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  module<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    rules<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        test<span class="token punctuation">:</span> <span class="token regex">/\\.js$/</span><span class="token punctuation">,</span>\n        exclude<span class="token punctuation">:</span> <span class="token regex">/node_modules/</span><span class="token punctuation">,</span>\n        use<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n          loader<span class="token punctuation">:</span> <span class="token string">"babel-loader"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  mode<span class="token punctuation">:</span> <span class="token string">"production"</span><span class="token punctuation">,</span>\n  plugins<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  resolve<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    modules<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"node_modules"</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<ul>\n<li>dev.config 와 동일</li>\n</ul>\n<h3>paths.js</h3>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"fs"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"url"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> appDirectory <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token function">realpathSync</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token function">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token function-variable function">resolveApp</span> <span class="token operator">=</span> relativePath <span class="token operator">=></span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>appDirectory<span class="token punctuation">,</span> relativePath<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  appPublic<span class="token punctuation">:</span> <span class="token function">resolveApp</span><span class="token punctuation">(</span><span class="token string">"public"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  appBuild<span class="token punctuation">:</span> <span class="token function">resolveApp</span><span class="token punctuation">(</span><span class="token string">"build"</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<ul>\n<li>path 를 관리하는 장소 ( 상세 설명은 생략 )</li>\n</ul>\n<h3>start.js ( dev start )</h3>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token string">"use strict"</span><span class="token punctuation">;</span>\n\nprocess<span class="token punctuation">.</span>env<span class="token punctuation">.</span>BABEL_ENV <span class="token operator">=</span> <span class="token string">"development"</span><span class="token punctuation">;</span>\nprocess<span class="token punctuation">.</span>env<span class="token punctuation">.</span>NODE_ENV <span class="token operator">=</span> <span class="token string">"development"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> Webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> WebpackDevServer <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack-dev-server"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> webpackConfig <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"../config/webpack.dev.config"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> webpackDevConfig <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"../config/webpackDevServer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> open <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"open"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// setting</span>\n<span class="token keyword">const</span> host <span class="token operator">=</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>HOST <span class="token operator">||</span> <span class="token string">"0.0.0.0"</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> proxyUrl <span class="token operator">=</span> <span class="token string">"http://nodeapp.local:8081"</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> publicPath <span class="token operator">=</span> <span class="token string">"/"</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> port <span class="token operator">=</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>PORT <span class="token operator">||</span> <span class="token number">3001</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> devServerOptions <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> webpackDevConfig<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  proxy<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"/"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      target<span class="token punctuation">:</span> proxyUrl<span class="token punctuation">,</span>\n      secure<span class="token punctuation">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  host<span class="token punctuation">,</span>\n  port<span class="token punctuation">,</span>\n  publicPath<span class="token punctuation">,</span>\n  stats<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    colors<span class="token punctuation">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nwebpackConfig<span class="token punctuation">.</span>plugins<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Webpack<span class="token punctuation">.</span>HotModuleReplacementPlugin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nwebpackConfig<span class="token punctuation">.</span>plugins<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Webpack<span class="token punctuation">.</span>NamedModulesPlugin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nWebpackDevServer<span class="token punctuation">.</span><span class="token function">addDevServerEntrypoints</span><span class="token punctuation">(</span>webpackConfig<span class="token punctuation">,</span> devServerOptions<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> compiler <span class="token operator">=</span> <span class="token function">Webpack</span><span class="token punctuation">(</span>webpackConfig<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> server <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebpackDevServer</span><span class="token punctuation">(</span>compiler<span class="token punctuation">,</span> devServerOptions<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nserver<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span>port<span class="token punctuation">,</span> host<span class="token punctuation">,</span> err <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Starting server on http://nodeapp.local:3001"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token function">open</span><span class="token punctuation">(</span><span class="token string">"http://nodeapp.local:3001"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>기본적으로 webpack 에선 express를 이용해서 devServer를 만듭니다.</p>\n<p>webpack dev server 에 필요한 추가적인 부분을 작성합니다. </p>\n<p><strong>devServerOptions</strong></p>\n<ul>\n<li>proxy 라는 부분을 이용해서 ”/” 경로로 들어왔을때 target 프록시 url로 요청을 보내서 받아오게 됩니다.</li>\n<li>publicPath 라는 부분은 개발시에 실제 서버 경로 처럼 사용할 수 있게 만들어 줍니다. 예를 들어 “/asset” 으로 설정해놓으면 실제로 dev 개발할 시 bundle의 주소는 /asset/bundle.js 로 참고 하게 됩니다.</li>\n</ul>\n<p><strong>HotModuleReplacementPlugin</strong></p>\n<ul>\n<li>hot module replace 모드를 활성화 시켜줍니다.</li>\n<li>절대 production 모드에선 사용하지 않습니다.</li>\n</ul>\n<p><strong>NamedModulesPlugin</strong></p>\n<ul>\n<li>hot module replace 모드 사용시 모듈의 상대 경로를 표시해줍니다. 개발시에 추천되는 플러그인 입니다.</li>\n</ul>\n<p>webpack dev 참고 : <br/>\n<a href="https://webpack.js.org/guides/hot-module-replacement/#via-the-node-js-api">https://webpack.js.org/guides/hot-module-replacement/#via-the-node-js-api</a>\n<a href="https://github.com/webpack/webpack-dev-server/tree/master/examples/api/simple">https://github.com/webpack/webpack-dev-server/tree/master/examples/api/simple</a></p>\n<h3>build.js ( prod bundle )</h3>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> paths <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"../config/paths"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> chalk <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"chalk"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"fs-extra"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> argv <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"yargs"</span><span class="token punctuation">)</span><span class="token punctuation">.</span>argv<span class="token punctuation">;</span>\n<span class="token keyword">const</span> webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> config <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"../config/webpack.prod.config"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>\n    <span class="token punctuation">(</span><span class="token punctuation">{</span> stats <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"build Success!!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token function">copyPublicFolder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    err <span class="token operator">=></span> <span class="token punctuation">{</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"build error"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Creating an optimized production build..."</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">let</span> compiler <span class="token operator">=</span> <span class="token function">webpack</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    compiler<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> stats<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n\n      <span class="token keyword">return</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">{</span> stats <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// copy folder and file</span>\n<span class="token keyword">function</span> <span class="token function">copyPublicFolder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  fs<span class="token punctuation">.</span><span class="token function">copySync</span><span class="token punctuation">(</span>paths<span class="token punctuation">.</span>appPublic<span class="token punctuation">,</span> paths<span class="token punctuation">.</span>appBuild<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>실제 배포 번들을 만든 뒤 파일 copy 하는 부분</p>\n<p>&#x3C; 추가 되어야 할 부분 ></p>\n<ul>\n<li>실제 배포되야할 번들 파일 뒤에 번들 리비젼 붙이기 </li>\n<li>기타 console.log 부분 제거와 optimized</li>\n</ul>\n<h2>Reference</h2>\n<hr>\n<ul>\n<li>해당 폴더 구성과 파일 구성등은 Create React App 을 참고 하였다.</li>\n</ul>',
frontmatter:{title:"webpack config",date:"March 14, 2018"}}},pathContext:{slug:"/webpack-config/"}}}});
//# sourceMappingURL=path---webpack-config-c55e3d5150079f37dba8.js.map