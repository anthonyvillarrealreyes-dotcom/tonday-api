const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// CONFIGURACIÓN MAESTRA CON DEPURACIÓN
const getEnv = (key) => {
  const value = process.env[key];
  console.log(`Verificando variable: ${key} = ${value}`);
  return value === 'true';
};

const CONFIG = {
  mlm: getEnv('mlm_enabled'),
  streaming: getEnv('streaming_enabled'),
  radio: getEnv('radio_enabled'),
  iptv: getEnv('iptv_enabled'),
  social: getEnv('social_enabled'),
  tienda: getEnv('tienda_enabled'),
  bridge: getEnv('bridge_enabled'),
  rastreo: getEnv('rastreo_enabled'),
  videointro: {
    enabled: getEnv('video_intro_enabled'),
    url: process.env.video_intro_url || ""
  }
};

app.get('/', (req, res) => {
  res.json({ 
    sistema: "tonday ecosistema maestro", 
    estado: "online", 
    modulos: CONFIG 
  });
});

app.get('/api/:servicio', (req, res) => {
  const { servicio } = req.params;
  if (!CONFIG[servicio]) {
    return res.status(403).json({ error: `modulo ${servicio} desactivado o no configurado` });
  }
  res.json({ mensaje: `acceso concedido a ${servicio}` });
});

app.get('/api/iptv/canales/:pais?', async (req, res) => {
  if (!CONFIG.iptv) return res.status(403).json({ error: "modulo iptv desactivado" });
  const pais = req.params.pais || 'index';
  try {
    const url = `https://iptv-org.github.io/iptv/${pais === 'index' ? 'index' : 'countries/' + pais}.m3u`;
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) { res.status(500).json({ error: "error de red en canales" }); }
});

app.get('/api/streaming/config', (req, res) => {
  if (!CONFIG.streaming) return res.status(403).json({ error: "modulo streaming desactivado" });
  res.json({
    fuente_datos: "tmdb api",
    status: "ready",
    api_key_status: process.env.tmdb_api_key ? "configurada" : "pendiente"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sistema Tonday operativo en puerto ${PORT}`);
});
