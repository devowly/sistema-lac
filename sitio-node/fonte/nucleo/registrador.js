'use strict';

var bunyan = require('bunyan');

// Usa as variaveis de ambiente LOGSTASH_HOST e LOGSTASH_PORT
// para enviar os registros para logstash por meio de udp.
var configuracao = {
  name: 'app-lac',
  streams: [{
    level: 'debug',
    stream: process.stdout
  }],
  level: 'debug'
};

if (process.env.LOGSTASH_HOST && process.env.LOGSTASH_PORT) {
  console.log('logstash habilitado');
  configuracao.streams.push({
    level: 'debug',
    type: 'raw',
    stream: require('bunyan-logstash-tcp').createStream({
      host: process.env.LOGSTASH_HOST,
      port: process.env.LOGSTASH_PORT
    })
  });
} else {
  console.log('logstash não habilitado');
}

var registro = bunyan.createLogger(configuracao);

function registrador(nome) {
  return registro.child({
    widget_type: nome // jshint ignore:line
  });
}

module.exports = registrador;