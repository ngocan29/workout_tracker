// Test đơn giản với curl 
const { exec } = require('child_process');

// Test POST
const postData = {
  userID: "67200e4e1c0adb2be855ec7f",
  chieucao: 170,
  cannang: 65
};

const curlCommand = `curl -X POST http://localhost:5000/dinhduong -H "Content-Type: application/json" -d "${JSON.stringify(postData).replace(/"/g, '\\"')}"`;

console.log('Testing POST /dinhduong...');
console.log('Command:', curlCommand);

exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
  }
  if (stderr) {
    console.error('Stderr:', stderr);
  }
  console.log('Response:', stdout);
});