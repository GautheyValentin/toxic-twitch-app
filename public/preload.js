const { Titlebar, Color } = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
  new Titlebar({
    backgroundColor: Color.fromHex('#2f3241'),
    menu: false,
    icon: './logo192.png',
    maximizable: false,
  });

  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector);
  //   if (element) element.innerText = text;
  // };
  // for (const type of ['chrome', 'node', 'electron']) {
  //   replaceText(`${type}-version`, process.versions[type]);
  // }
});
