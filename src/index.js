const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// CONFIGURACIÓN MAESTRA
const getEnv = (key) => {
  const value = process.env[key];
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
  },
  // Nuevas funciones de seguridad e identidad
  kyc: getEnv('kyc_enabled'),
  bank_integration: getEnv('bank_integration_enabled')
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
    return res.status(403).json({ error: `modulo ${servicio} desactivado` });
  }
  res.json({ mensaje: `acceso concedido a ${servicio}` });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Sistema Tonday operativo en puerto ${PORT}`);
});
