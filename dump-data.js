const fs = require('fs');

async function dumpData() {
  try {
    const res = await fetch('http://localhost:3000/api/dump?username=alinnarosee');
    const data = await res.json();
    fs.writeFileSync('./src/data/alinnarosee2.json', JSON.stringify(data, null, 2));
    console.log('Successfully saved to src/data/alinnarosee2.json');
  } catch (error) {
    console.error('Failed to dump data:', error);
  }
}

dumpData();
