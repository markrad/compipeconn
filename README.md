# compipeconn
Connect a serial port and named pipe together.

This is a simple node script connects a serial port to a named pipe on a Windows machine. The motivation behind this is to allow one to access a serial device attached to the host machine from an operating system running in a Hyper-V virtual machine.

Hyper-V machines expose COM1 and COM2 as named paths. These can be set up in the machine settings dialog. Once you have named your serial pipe for the virtual machine you simply need to modify the file ```config.js``` to reflect your requirements. This contains only three configuration options. 
1) The name of the pipe
2) The COM port on the host with which to connect
3) The baud rate of the serial connection

Once this file has been modified and saved simply run ```node compipeconn```. This will forward all input from the serial port to the named pipe and all input from the named pipe to the serial port.

A sample config.js file is provided.

When this is first cloned, one should run ```npm install``` to acquire and install the package dependencies. 
