import 'dotenv/config';
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const __dirname = path.resolve();

// Middleware para parsear el body de las requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  if (usuario === process.env.USUARIO && contrasena === process.env.CONTRASENA) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Usuario o clave incorrectos' });
  }
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/login', async (req, res) => {
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
      res.status(200).json({ success: true, message: "Autenticación correcta", token: result });
    } else {
      res.status(response.status).json({ success: false, message: "Autenticación fallida" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error durante la autenticación" });
  }
});

// Configurar el proxy
app.use('/proxy', createProxyMiddleware({
  target: 'https://apis.andreani.com',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    const token = req.headers['x-authorization-token'];
    if (token) {
      proxyReq.setHeader('x-authorization-token', token);
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
