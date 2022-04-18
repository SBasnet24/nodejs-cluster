const { cpus } = require("os");
const cluster = require("cluster");
const express = require("express");

const app = express();

// Scaling nodejs application via cluster
if (cluster.isMaster) {
  const numCPUs = cpus();
  console.log(`Clustering application to ${numCPUs.length} processes`);
  numCPUs.forEach(() => cluster.fork()); // running app.js in worker mode in

  //  if the cluster is disconnected in some ways we can use this code
  cluster.on("exit", (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} crashed. Starting a new worker mode`);
      cluster.fork();
    }
  });
} else {
  const { pid } = process;

  setTimeout(() => {
    throw new Error("Ooops");
  }, Math.ceil(Math.random() * 3) * 1000);

  app.get("/", (req, res) => {
    let i = 1e7;
    while (i > 0) {
      i--;
    }
    console.log(`Request is being handled by process_id: ${pid}`);
    res.send(`Hello from ${pid}\n`);
  });
  app.listen(8080, () => console.log(`Started at ${pid}`));
}
// npx autocannon -c 2000 -d 10 http://localhost:8080 use this command to see the latency
