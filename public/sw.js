if(!self.define){let e,i={};const c=(c,a)=>(c=new URL(c+".js",a).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,n)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let f={};const o=e=>c(e,s),r={module:{uri:s},exports:f,require:o};i[s]=Promise.all(a.map((e=>r[e]||o(e)))).then((e=>(n(...e),f)))}}define(["./workbox-67e23458"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"6efea2ab0195e8881013f5037f6991d0"},{url:"/_next/static/chunks/203.2b4c1ee4fbe3a7cf.js",revision:"2b4c1ee4fbe3a7cf"},{url:"/_next/static/chunks/218.57a830a2c55ba802.js",revision:"57a830a2c55ba802"},{url:"/_next/static/chunks/393-3df332a95cb5cd3d.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/4bd1b696-da8e76c23d6f3c51.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/517-16cc4ae028a7f443.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/app/_not-found/page-1a63dec8d17ec4eb.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/app/layout-6f21259b90ef0906.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/app/page-05beb6ad0541550e.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/framework-6b27c2b7aa38af2d.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/main-app-8a46ec09ddd9b3fe.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/main-ceee0bbff390fab8.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/pages/_app-430fec730128923e.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/pages/_error-2d7241423c4a35ba.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-ce5ccca75e118357.js",revision:"s0nfSgjWOi1-FQV1J9Vmf"},{url:"/_next/static/css/7d688118f46decbb.css",revision:"7d688118f46decbb"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/369c6e283c5acc6e-s.woff2",revision:"34948aa90530377596bc7544c3bce4a3"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/92f44bb82993d879-s.p.woff2",revision:"17e694a0b8c65a1cc2b0206f83baccc9"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/b2f7755ffc613443-s.woff2",revision:"a656d88aad98480ff50d712f69857586"},{url:"/_next/static/media/c21b67b0a36892e5-s.woff2",revision:"502ed7d7f764d97a12168094ece5c454"},{url:"/_next/static/media/c5a3bf8cfa32037a-s.woff2",revision:"6ccf916683b7fd3d274b95b42c9786df"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/ffff0c425fbeefe6-s.woff2",revision:"6224b6cfd003252c8d4c908f53470565"},{url:"/_next/static/s0nfSgjWOi1-FQV1J9Vmf/_buildManifest.js",revision:"4bc90ed42ad5948e96d6aabccada938c"},{url:"/_next/static/s0nfSgjWOi1-FQV1J9Vmf/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icon/android-icon-144x144.png",revision:"5aaf299303e44725e3a072f8f300231e"},{url:"/icon/android-icon-192x192.png",revision:"05e9406d8ba3de48503056cc0f27ec94"},{url:"/icon/android-icon-36x36.png",revision:"2a73738e95999f5aaeed9f70fb83a16e"},{url:"/icon/android-icon-48x48.png",revision:"f2f4e1a90aa12223c9fb933332d9c3cb"},{url:"/icon/android-icon-72x72.png",revision:"587494df6f114e7030a40c5b59a75c38"},{url:"/icon/android-icon-96x96.png",revision:"3a85d2e155c8ebafc7b1c76a92b038db"},{url:"/icon/apple-icon-114x114.png",revision:"125fc31910ebf31e99c55e6d934aa917"},{url:"/icon/apple-icon-120x120.png",revision:"cc5ac6c521376bec3cb69b5827094601"},{url:"/icon/apple-icon-144x144.png",revision:"c35affcd651e11a2898c68f084d7022e"},{url:"/icon/apple-icon-152x152.png",revision:"c8d57da9e14ee4fe893c023d6a2d0c9b"},{url:"/icon/apple-icon-180x180.png",revision:"53c260b26894bd69885596174d531639"},{url:"/icon/apple-icon-57x57.png",revision:"e1e3ad3a439e87ccd063223810c5e8ba"},{url:"/icon/apple-icon-60x60.png",revision:"4bc9635a65f2e8560cfb264ccdbba80a"},{url:"/icon/apple-icon-72x72.png",revision:"faa7875181630079ff7323b4cb402981"},{url:"/icon/apple-icon-76x76.png",revision:"fda08da5f964b064bae718cd3b4c4cd7"},{url:"/icon/apple-icon-precomposed.png",revision:"3df6d548e298aa4d569ee518d9cd7ba7"},{url:"/icon/apple-icon.png",revision:"3df6d548e298aa4d569ee518d9cd7ba7"},{url:"/icon/favicon-16x16.png",revision:"a1be562659a6f53a51e6abce6556011f"},{url:"/icon/favicon-32x32.png",revision:"689edc7717eadad4c1963d4a48c0ef7f"},{url:"/icon/favicon-96x96.png",revision:"63f2957480f92fb90f5821052cc3afad"},{url:"/icon/favicon.ico",revision:"d4567fb21731dcb4e0bf33fe5e8a1751"},{url:"/icon/ms-icon-144x144.png",revision:"c35affcd651e11a2898c68f084d7022e"},{url:"/icon/ms-icon-150x150.png",revision:"f6211d1dc678596a27eebba349eb5d16"},{url:"/icon/ms-icon-310x310.png",revision:"668af9051e7e1359446e18d7100836a7"},{url:"/icon/ms-icon-70x70.png",revision:"8ae029369a1ed4e22d0ef6b0f550cd78"},{url:"/icon512_maskable.png",revision:"727d9bf995d779a889bb6b263c532c2c"},{url:"/icon512_rounded.png",revision:"6b2f5a8b8723aba10554a5081b7f4e00"},{url:"/manifest.json",revision:"77e93a38ccf717fd5736fa1ab3add0c7"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:i,event:c,state:a})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),e.registerRoute(/^https:\/\/api-assets\.clashroyale\.com\/.*/i,new e.CacheFirst({cacheName:"clash-royale-assets",plugins:[new e.ExpirationPlugin({maxEntries:500,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/api\.clashroyale\.com\/v1\/.*/i,new e.NetworkFirst({cacheName:"clash-royale-api",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:300})]}),"GET"),e.registerRoute(/\.(?:png|jpg|jpeg|svg|gif)$/,new e.CacheFirst({cacheName:"image-cache",plugins:[new e.ExpirationPlugin({maxEntries:100,maxAgeSeconds:2592e3})]}),"GET")}));
