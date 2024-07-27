import 'dotenv/config';
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', async (req, res) => {
  console.log('Login route accessed');  // Línea de depuración
  const user = process.env.API_USER;
  const password = process.env.API_PASSWORD;

  const credentials = Buffer.from(`${user}:${password}`).toString('base64');
  const myHeaders = {
    "Authorization": `Basic ${credentials}`
  };

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch("https://apis.andreani.com/login", requestOptions);
    if (response.ok) {
      const result = await response.text();
      console.log('API response received');  // Línea de depuración
      res.status(200).json({ success: true, message: "Autenticación correcta", token: result });
    } else {
      res.status(response.status).json({ success: false, message: "Autenticación fallida" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error durante la autenticación" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});