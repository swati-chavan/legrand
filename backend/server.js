const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


let dataStore = [];



app.get('/', (req, res) => {
  res.send('API is working ✅');
});

app.post('/api/save', (req, res) => {
  const data = req.body;
  dataStore.push(data); // store data in memory

  res.status(200).json({ message: 'Data received', storedData: data });
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
