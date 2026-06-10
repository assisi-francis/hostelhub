const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'about.html',
  'pages/landlord/dashboard.html',
  'pages/landlord/listings.html',
  'pages/landlord/messages.html',
  'pages/landlord/verification.html',
  'pages/student/dashboard.html',
  'pages/student/messages.html',
  'pages/student/saved.html',
  'pages/student/settings.html' // in case it exists
];

files.forEach(file => {
  const filePath = path.join('/Users/macbook/Downloads/FrontEnd_Training/FrontEnd/hostelhub', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const isRoot = file === 'index.html' || file === 'about.html';
  const prefix = isRoot ? '' : '../../';

  // Replace Terms link
  content = content.replace(
    /<a href="[^"]*"(?: class="db-footer-link")?(?: onclick="[^"]*")?>Terms, Privacy & Policies<\/a>/g,
    (match) => {
      let classStr = match.includes('class="db-footer-link"') ? ' class="db-footer-link"' : '';
      return `<a href="${prefix}terms.html"${classStr}>Terms, Privacy & Policies</a>`;
    }
  );

  // Replace Contact Support link
  content = content.replace(
    /<a href="[^"]*"(?: class="db-footer-link")?>Contact Support<\/a>/g,
    (match) => {
      let classStr = match.includes('class="db-footer-link"') ? ' class="db-footer-link"' : '';
      return `<a href="${prefix}contact.html"${classStr}>Contact Support</a>`;
    }
  );

  // Replace About Us link
  content = content.replace(
    /<a href="[^"]*"(?: class="db-footer-link")?>About Us<\/a>/g,
    (match) => {
      let classStr = match.includes('class="db-footer-link"') ? ' class="db-footer-link"' : '';
      return `<a href="${prefix}about.html"${classStr}>About Us</a>`;
    }
  );

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
