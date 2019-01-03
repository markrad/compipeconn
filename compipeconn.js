'define strict';

const { connect } = require('net');
const options = require('./config.json');
const SerialPort = require('serialport');

var PIPE_NAME = options.pipe.name || "zwave";
var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;
var PORT = options.serial.port;
var BAUD_RATE = options.serial.baudrate;
var closing = 0;

const port = new SerialPort(PORT, { autoOpen: false, baudRate: BAUD_RATE });

process.on('SIGINT', () => closing = 1 );

var client = connect(PIPE_PATH, () => 
{
    console.log('Client: on connection');
});

port.open((err) => 
{
	if (err) 
	{
		console.log('Error opening port: ', err.message);
		process.exit();
	}
});

port.on('data', (data) => 
{
	process.stdout.write(data);
	client.write(data.toString());
});

port.on('error', (err) =>
{
	console.log(err);
});

// The open event is always emitted
port.on('open', () => 
{
	console.log('Port: on connection');
});

client.on('data', (data) =>
{
	process.stdout.write(data.toString());
	port.write(data, (err) =>
	{
		if (err)
		{
			console.log('Port write error ' + err);
		}
	});
});

client.on('end', () => 
{
    console.log('Client: on end');
	closing++;
});

setInterval(() => 
{ 
	if (closing != 0)
	{
		if (closing == 3)
		{
			process.exit();
		}

		console.log("Waiting for closure");

		port.close((err) =>
		{
			if (err)
			{
				console.log('Error closing port: ' + err);
			}
			else
			{
				console.log('Port closed');
			}
			closing++;
		});
		
		client.end();
	}
}, 100);
