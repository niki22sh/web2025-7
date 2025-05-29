const { Pool } = require('pg');
const express = require("express");

require('dotenv').config();

const app = express();
app.use(express.text());
app.use(express.json());

const PORT = process.env.PORT
const HOST = process.env.HOST
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

async function deviceExists(serialNumber){
  const result = await db.query('SELECT * FROM devices WHERE serial_number = $1', [serialNumber]);

  if (result.rows.length) {
    return true;
  } else{
    return false;
  }
}

app.post('/register', async(req, res) =>{
  const {device_name, serial_number} = req.body;
  if(await deviceExists(serial_number)){
    res.status(400).send('Bad request');
  } else{
    await db.query('INSERT INTO devices (device_name, serial_number) VALUES ($1, $2)', [device_name, serial_number]);
    res.status(200).send('OK');
  }
})

app.get('/devices', async(req, res) =>{
  const result = await db.query('SELECT device_name, serial_number FROM devices');
  res.json(result.rows);
})

app.post('/take', async(req, res) => {
  const {user_name, serial_number} = req.body;
  const device = await db.query(
      'SELECT * FROM devices WHERE serial_number = $1', [serial_number]);

  if (!await deviceExists(serial_number)) {
    return res.status(404).send("Not Found");
  }

  if (device.rows[0].user_name && !device.rows[0].returned_at) {
    return res.status(400).send("Bad Request");
  }
  await db.query(
      `UPDATE devices SET user_name = $1, taken_at = NOW(), returned_at = NULL WHERE serial_number = $2`, [user_name, serial_number]);
  res.status(200).send("OK");
})

app.get('/devices/:serialNumber', async(req, res) =>{
  const serialNumber = req.params.serialNumber;
  if(await deviceExists(serialNumber)){
  const result = await db.query('SELECT user_name, device_name FROM devices WHERE serial_number = $1', [serialNumber])
    res.json(result.rows);
  } else {
    res.status(404).send("Not found");
  }
})

app.post('/back', async(req, res) => {
  const {user_name, serial_number} = req.body;

    if(!await deviceExists(serial_number)) {
      return res.status(404).send("Not Found");
    }

    const deviceCheck = await db.query('SELECT * FROM devices WHERE serial_number = $1 AND user_name = $2', [serial_number, user_name]);

    if (deviceCheck.rows.length === 0) {
      return res.status(400).send('Bad request');
    }

    await db.query(
      'UPDATE devices SET returned_at = NOW(), user_name = NULL WHERE serial_number = $1', [serial_number]);
    res.status(200).send('OK');
});

app.listen(PORT, HOST, () => {
  console.log(`Сервер працює на http://${HOST}:${PORT}`);
})



