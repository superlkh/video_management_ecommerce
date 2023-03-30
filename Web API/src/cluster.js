const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  // 1 luồn = 1 cpu
  const cpus = os.cpus().length;

  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  // Nếu có 1 worker bị crash, đăng ký worker mới
  cluster.on("exit", (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.id} crashed.` + "Starting a new worker...");
      cluster.fork();
    }
  })
} else {
  require("./server");
}