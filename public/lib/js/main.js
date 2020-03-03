const brL = str => {
  console.log(`%c${str}`, 'font-weight: bold; font-size: 50px;color: #00FF00; ')
}

(() => {
  var typedLoad = new Typed('#firstLoad', {
    strings: ['<pre><output>\n  webpack: Compiling...\n  `webpack: Compiled successfully.`\n  `Hash: 33d8c38093d5e8261eac`\n  `Version: webpack 3.11.0`\n  `Time: 1337ms`\n                                 Asset       Size  Chunks                    Chunk Names\n                           mainView.js    12.3 MB       0  [emitted]  [big]  display\n                      userinterface.js    6.36 MB       1  [emitted]  [big]  ui\n                           organize.js    5.29 MB       2  [emitted]  [big]  organize\n                         memeloader.js    4.92 MB       3  [emitted]  [big]  memeBoss\n  0.81c79b4db476a98d272f.hot-update.js    87.4 kB       0  [emitted]         project\n  1.81c79b4db476a98d272f.hot-update.js    7.94 kB       1  [emitted]         dashboard\n  81c79b4db476a98d272f.hot-update.json   52 bytes          [emitted]\n                         manifest.json  272 bytes          [emitted]\n`[./app/javascript/common/components/Overlay.js] ./app/javascript/common/components/Overlay.js 2.42 kB`</output></pre>'],
    startDelay: 1800,
    typeSpeed: -10000,
    cursorChar: '▮',
    onBegin: function(self){
      console.time('Typing duration')
    },
    onComplete: function(self){
      console.timeEnd('Typing duration')
    }
    })
})();


function updateScroll(){
  var element = document.getElementById("terminal");
  element.scrollTop = element.scrollHeight;
}

setTimeout(function () {
  let inputArea = document.querySelector('#line');
  inputArea.style.borderBottom = 'solid 1px var(--terminalGreen)';
}, 16500)

setInterval(updateScroll(), 500)