import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the plugins root directory
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const pluginsRoot = path.join(projectRoot, "resources/js/plugins");

// Write a project.json only when it does not exist yet
for (const entry of fs.readdirSync(pluginsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const pluginDir = path.join(pluginsRoot, entry.name);
    if (!fs.existsSync(path.join(pluginDir, "vite.config.ts"))) continue;

    const file = path.join(pluginDir, "project.json");
    if (fs.existsSync(file)) continue;

    const project = {
        name: `plugin-${entry.name}`,
        $schema: "../../../../node_modules/nx/schemas/project-schema.json",
        projectType: "application",
        implicitDependencies: ["core"],
        sourceRoot: `resources/js/plugins/${entry.name}`,
        tags: ["type:plugin", `scope:${entry.name}`],
        targets: Object.fromEntries(
            ["admin", "client"].flatMap((panel) => [
                [`build-${panel}`, {
                    executor: "nx:run-commands",
                    options: {
                        command: "vite build --config vite.config.ts",
                        cwd: `resources/js/plugins/${entry.name}`,
                        env: { BUILD_TARGET: panel, PLUGIN_NAME: entry.name },
                    },
                }],
                [`dev-${panel}`, {
                    executor: "nx:run-commands",
                    options: {
                        command: "vite build --config vite.config.ts --watch",
                        cwd: `resources/js/plugins/${entry.name}`,
                        env: { BUILD_TARGET: panel, PLUGIN_NAME: entry.name },
                    },
                }],
            ]),
        ),
    };

    fs.writeFileSync(file, JSON.stringify(project, null, 2) + "\n");
    console.log(`[gen-nx] created ${file}`);
}
