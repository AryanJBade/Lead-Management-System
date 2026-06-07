const { execSync } = require("child_process");

const port = process.env.PORT || 5000;

function getPidsOnPort(port) {
    try {
        if (process.platform === "win32") {
            const output = execSync(`netstat -ano | findstr :${port}`, {
                encoding: "utf8",
                stdio: ["pipe", "pipe", "ignore"]
            }).trim();

            return [...new Set(
                output
                    .split(/\r?\n/)
                    .map((line) => line.trim().split(/\s+/).pop())
                    .filter(Boolean)
            )];
        }

        const output = execSync(`lsof -i :${port} -t`, {
            encoding: "utf8",
            stdio: ["pipe", "pipe", "ignore"]
        }).trim();

        return [...new Set(
            output
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
        )];
    } catch (error) {
        return [];
    }
}

function killPids(pids) {
    for (const pid of pids) {
        try {
            process.kill(parseInt(pid, 10), "SIGTERM");
            console.log(`Stopped process ${pid} on port ${port}`);
        } catch (error) {
            // ignore failures to kill
        }
    }
}

const pids = getPidsOnPort(port);
if (pids.length > 0) {
    console.log(`Found ${pids.length} process(es) using port ${port}: ${pids.join(", ")}`);
    killPids(pids);
} else {
    console.log(`No process found on port ${port}`);
}
