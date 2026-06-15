const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const getEnv = (key) => process.env[key] === 'true';

const CONFIG = {
  mlm: getEnv('mlm_enabled'),
  streaming: getEnv('streaming_enabled'),
  radio: getEnv('radio_enabled'),
  iptv: getEnv('iptv_enabled'),
  social: getEnv('social_enabled'),
  tienda: getEnv('tienda_enabled'),
  bridge: getEnv('bridge_enabled'),
  rastreo: getEnv('rastreo_enabled'),
  kyc: getEnv('kyc_enabled'),
  bank_integration: getEnv('bank_integration_enabled'),
  videointro: getEnv('videointro_enabled'), // Nuevo módulo integrado
  tmdb_api_key: process.env.TMDB_API_KEY
};

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ sistema: "tonday-group", estado: "online", modulos: CONFIG });
});

// 1. Módulo IPTV - Headless
app.get('/api/iptv/lista', async (req, res) => {
  if (!CONFIG.iptv) return res.status(403).json({ error: "Servicio IPTV desactivado" });
  res.redirect('https://iptv-org.github.io/iptv/index.m3u');
});

// 2. Módulo RADIO - Headless
app.get('/api/radio/stream', async (req, res) => {
  if (!CONFIG.radio) return res.status(403).json({ error: "Servicio RADIO desactivado" });
  res.redirect('https://tu-servidor-de-radio.com/stream'); 
});

// 3. Módulo TMDB - Catálogo Masivo
app.get('/api/catalogo/:categoria', async (req, res) => {
  if (!CONFIG.streaming) return res.status(403).json({ error: "Servicio Streaming desactivado" });
  const { categoria } = req.params; 
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/discover/${categoria}`, {
      params: { 
        api_key: CONFIG.tmdb_api_key, 
        'primary_release_date.gte': '1950-01-01',
        sort_by: 'popularity.desc'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error al conectar con TMDB" });
  }
});

// 4. Módulo Rastreo
app.get('/api/rastreo/info', (req, res) => {
  if (!CONFIG.rastreo) return res.status(403).json({ error: "Servicio RASTREO desactivado" });
  res.json({ status: "activo", info: "Sistema de rastreo Tonday en línea" });
});

// 5. Módulo KYC / Bancario
app.post('/api/auth/verificar', (req, res) => {
  if (!CONFIG.kyc && !CONFIG.bank_integration) return res.status(403).json({ error: "Seguridad desactivada" });
  res.json({ status: "iniciado", mensaje: "Verificación de identidad y banca iniciada" });
});

// 6. Módulo Video Intro
app.get('/api/videointro/stream', (req, res) => {
  if (!CONFIG.videointro) return res.status(403).json({ error: "Servicio VIDEO INTRO desactivado" });
  // Aquí redireccionarás a tu URL de video de intro
  res.redirect('https://tu-servidor.com/video-intro-url');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Sistema Tonday operativo en puerto ${PORT}`);
});
