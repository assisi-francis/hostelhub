const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('pages/landlord/messages.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });

const window = dom.window;
const document = window.document;

// Mock localStorage
window.localStorage.setItem('user', JSON.stringify({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "1234567890",
  avatar: "data:image/jpeg;base64,ABC"
}));

// We need to wait for scripts to be executed
setTimeout(() => {
  // Scripts in jsdom are executed asynchronously
  console.log("Before dispatch:");
  console.log("Img src:", document.getElementById('navbarAvatarImg').src);
  console.log("Img display:", document.getElementById('navbarAvatarImg').style.display);
  console.log("Svg display:", document.getElementById('navbarAvatarSvg').style.display);

  document.dispatchEvent(new window.Event('DOMContentLoaded'));

  console.log("\nAfter dispatch:");
  console.log("Img src:", document.getElementById('navbarAvatarImg').src);
  console.log("Img display:", document.getElementById('navbarAvatarImg').style.display);
  console.log("Svg display:", document.getElementById('navbarAvatarSvg').style.display);
}, 1000);
