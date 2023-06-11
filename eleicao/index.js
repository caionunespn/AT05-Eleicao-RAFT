const { fork } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const { networkInterfaces } = require('os');

const MAXNODES = 5;
const nodes = [];

function randomIndex() {
    return Math.floor(Math.random() * MAXNODES);
}

function getNodeId() {
  const interfaces = networkInterfaces();
  let ipAddress;

  Object.keys(interfaces).forEach((interfaceName) => {
    const addresses = interfaces[interfaceName];
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      if (address.family === 'IPv4' && !address.internal) {
        ipAddress = address.address;
        break;
      }
    }
  });

  const pid = process.pid;
  return `${ipAddress}_${pid}_${uuidv4()}`;
}

function startElection() {
  console.log('Starting election process...');
  for (let i = 0; i < MAXNODES; i++) {
    const nodeId = getNodeId();
    const childProcess = fork('./nodeChild.js');
    childProcess.send({ nodeId });

    childProcess.on('message', (message) => {
        nodes.push(message);
        
        if (nodes.length === MAXNODES) {
            const leader = nodes[randomIndex()];
            console.log(`The leader is ${leader.nodeId}`);
        }
    });
  }
}

startElection();
