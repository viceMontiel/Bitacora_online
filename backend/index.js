import https from 'https';
import http from 'http';
import fs from 'fs';
import app from './app.js';
import { serverConfig, sslConfig } from './config.js';

if (sslConfig.useSSL === 'true') {
  // Cargar certificados SSL
  if (!sslConfig.cert || !sslConfig.key) {
    console.error("Error: Rutas de los certificados SSL no están configuradas.");
    process.exit(1); // Finaliza la ejecución si no hay certificados
  }

  const sslOptions = {
    cert: fs.readFileSync(sslConfig.cert),
    key: fs.readFileSync(sslConfig.key),
  };

  // Crear servidor HTTPS
  https.createServer(sslOptions, app).listen(serverConfig.port, () => {
    console.log(`Servidor seguro ejecutándose en https://localhost:${serverConfig.port}`);
  });

  // Servidor HTTP para redirección a HTTPS
  const redirectPort = sslConfig.redirect_port;
  http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  }).listen(redirectPort, () => {
    console.log(`Servidor HTTP redirigiendo a HTTPS en el puerto ${redirectPort}`);
  });

} else {
  // Crear servidor HTTP estándar
  app.listen(serverConfig.port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${serverConfig.port}`);
  });
}

// Manejo de errores inesperados
process.on('uncaughtException', (err) => {
  console.error('Excepción no controlada:', err);
  process.exit(1); // Finaliza el proceso para evitar estados inestables
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo no controlado:', reason);
});
