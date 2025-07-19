const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('utils/output_with_uuid.csv') // Adjust path if CSV is elsewhere
  .pipe(csv())
  .on('data', (data) => {
    // Replace all 'nan' strings (case-insensitive) with JavaScript NaN
    for (let key in data) {
      if (typeof data[key] === 'string' && data[key].toLowerCase() === 'nan') {
        data[key] = NaN;
      }
    }
    results.push(data);
  })
  .on('end', () => {
    const jsContent = `const clothingData = ${JSON.stringify(results, null, 2).replace(/null/g, 'NaN')};\n\nmodule.exports = clothingData;\n`;
    fs.writeFileSync('utils/clothingData.js', jsContent, 'utf8');
    console.log('✅ clothingData.js file created with NaN replacements.');
  });
