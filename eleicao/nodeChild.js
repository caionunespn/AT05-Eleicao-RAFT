function randomTrueOrFalse() {
  return Math.random() >= 0.5;
}

process.on('message', (message) => {
  const processingTime = Math.floor(Math.random() * 5000) + 1000;

  const nodeId = message.nodeId;

  setTimeout(() => {
    console.log(`Node ${nodeId} finished the election process.`);
    process.send({ nodeId: nodeId, voted: true });
    process.exit();
  }, processingTime);
});