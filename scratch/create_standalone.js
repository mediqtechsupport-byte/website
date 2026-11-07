const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Extract head styles
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>') + 8;
const styles = html.slice(styleStart, styleEnd);

// Extract Tailwind / fonts links
const headLinks = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            sky: '#3aa0db',
            cream: '#f6f2ea'
          }
        }
      }
    };
  </script>
`;

const prodStart = html.indexOf('<section id="products"');
const prodEnd = html.indexOf('</section>', prodStart) + 10;
const prodSection = html.slice(prodStart, prodEnd);

const standalone = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Products Section Preview</title>
  ${headLinks}
  ${styles}
</head>
<body class="bg-[#07132b] text-cream overflow-hidden m-0 p-0">
  ${prodSection}
  <script src="../assets/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync('scratch/preview_products_standalone.html', standalone, 'utf8');
console.log('Created standalone products preview HTML!');

