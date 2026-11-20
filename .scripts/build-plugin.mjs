import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the script directory in ESM mode.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Project root is the parent of /scripts
 */
const projectRoot = path.join(__dirname);
const pluginsRoot = path.join(projectRoot, "resources/js/plugins");
const viteBin = path.join(projectRoot, "node_modules", "vite", "bin", "vite.js");

const [pluginArg = "all", targetArg = "all"] = process.argv.slice(2);

function fail(message) {
    console.error(`\n[build-plugin] ${message}`);
    process.exit(1);
}

/**
 * Returns all plugin directory names.
 */
function listPlugins() {
    if (!fs.existsSync(pluginsRoot)) {
        fail(`Plugins directory not found: ${pluginsRoot}`);
    }

    return fs
        .readdirSync(pluginsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
}

/**
 * Resolves build targets.
 */
function resolveTargets(target) {
    if (target === "all") return ["admin", "client"];
    if (target === "admin" || target === "client") return [target];
    fail(`Invalid target "${target}". Use admin | client | all`);
}

/**
 * Builds a single plugin target.
 */
function runBuild(pluginName, target) {
    const pluginDir = path.join(pluginsRoot, pluginName);
    const configPath = path.join(pluginDir, "vite.federation.config.ts");

    if (!fs.existsSync(pluginDir)) {
        fail(`Plugin directory not found: ${pluginDir}`);
    }

    if (!fs.existsSync(configPath)) {
        fail(`Missing Vite config: ${configPath}`);
    }

    if (!fs.existsSync(viteBin)) {
        fail(`Vite binary not found: ${viteBin}\nRun: npm install`);
    }

    console.log(`\n==> Building plugin "${pluginName}" for target "${target}"`);
    console.log(`[debug] projectRoot: ${projectRoot}`);
    console.log(`[debug] pluginDir:   ${pluginDir}`);
    console.log(`[debug] viteBin:     ${viteBin}`);
    console.log(`[debug] configPath:  ${configPath}`);

    const result = spawnSync(
        process.execPath,
        [viteBin, "build", "--config", "vite.federation.config.ts"],
        {
            cwd: pluginDir,
            stdio: "inherit",
            shell: process.platform === "win32",
            env: {
                ...process.env,
                BUILD_TARGET: target,
                PLUGIN_NAME: pluginName
            }
        }
    );

    if (result.error) {
        fail(`Spawn error: ${result.error.message}`);
    }

    if (result.status !== 0) {
        fail(`Build failed for plugin "${pluginName}" target "${target}"`);
    }
}

const availablePlugins = listPlugins();

if (!availablePlugins.length) {
    fail(`No plugins found in: ${pluginsRoot}`);
}

const selectedPlugins = pluginArg === "all" ? availablePlugins : [pluginArg];

for (const pluginName of selectedPlugins) {
    if (!availablePlugins.includes(pluginName)) {
        fail(`Plugin "${pluginName}" not found. Available plugins: ${availablePlugins.join(", ")}`);
    }

    for (const target of resolveTargets(targetArg)) {
        runBuild(pluginName, target);
    }
}

console.log("\n[build-plugin] Done.");
