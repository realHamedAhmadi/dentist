import type { Plugin, ResolvedConfig } from "vite"
import { parse } from "@babel/parser"
import traverseModule from "@babel/traverse"
import type { NodePath } from "@babel/traverse"
import generatorModule from "@babel/generator"
import * as t from "@babel/types"
import path from "path"
import fs from "fs"
import crypto from "crypto"

/**
 * CJS/ESM interop helper
 */
function interop<T>(mod: T): any {
    return (mod as any)?.default ?? mod
}

const traverse = interop(traverseModule)
const generate = interop(generatorModule)

type RuntimeMeta = {
    locationId: string
    module: string
    moduleVersion: string
    file: string
    line: number
    column: number
}

type FullMeta = RuntimeMeta & {
    className: string | null
    functionName: string | null
    panel: string
}

export default function locationModule(): Plugin {
    const marker = "__location__"
    const locationMap: Record<string, FullMeta> = {}
    let config: ResolvedConfig

    return {
        name: "vite-module-location",
        enforce: "pre",

        configResolved(resolved) {
            config = resolved
        },

        transform(code, id) {
            // Only process TS/TSX files
            if (!/\.tsx?$/.test(id)) return null
            // Fast path: skip files without marker
            if (!code.includes(marker)) return null

            const ast = parse(code, {
                sourceType: "module",
                sourceFilename: id,
                errorRecovery: true,
                plugins: [
                    "typescript",
                    "jsx",
                    "classProperties",
                    "classPrivateProperties",
                    "classPrivateMethods",
                    "decorators-legacy",
                ],
            })

            let changed = false

            /**
             * 1) const x = __location__
             */
            traverse(ast, {
                VariableDeclarator(pathVar: NodePath<t.VariableDeclarator>) {
                    const init = pathVar.node.init
                    if (!t.isIdentifier(init, { name: marker })) return

                    pathVar.node.init = buildReplacementMeta(pathVar, init, id, locationMap)
                    changed = true
                },
            })

            /**
             * 2) fn(__location__) or new X(__location__)
             */
            traverse(ast, {
                CallExpression(pathCall: NodePath<t.CallExpression>) {
                    const args = pathCall.node.arguments
                    for (let i = 0; i < args.length; i++) {
                        const arg = args[i]
                        if (t.isIdentifier(arg, { name: marker })) {
                            args[i] = buildReplacementMeta(pathCall, arg, id, locationMap)
                            changed = true
                        }
                    }
                },
                NewExpression(pathNew: NodePath<t.NewExpression>) {
                    const args = pathNew.node.arguments ?? []
                    for (let i = 0; i < args.length; i++) {
                        const arg = args[i]
                        if (t.isIdentifier(arg, { name: marker })) {
                            args[i] = buildReplacementMeta(pathNew, arg, id, locationMap)
                            changed = true
                        }
                    }
                },
            })

            /**
             * 3) { a: __location__ }  (value only, not key)
             * 4) { __location__ }     (shorthand)
             */
            traverse(ast, {
                ObjectProperty(pathProp: NodePath<t.ObjectProperty>) {
                    const node = pathProp.node

                    // Handle shorthand case: { __location__ }
                    if (
                        node.shorthand &&
                        t.isIdentifier(node.key, { name: marker }) &&
                        t.isIdentifier(node.value, { name: marker })
                    ) {
                        node.shorthand = false
                        node.value = buildReplacementMeta(pathProp, node.value, id, locationMap)
                        changed = true
                        return
                    }

                    // Handle value case: { a: __location__ }
                    if (t.isIdentifier(node.value, { name: marker })) {
                        // Skip key-context when key itself is marker
                        if (t.isIdentifier(node.key, { name: marker }) && !node.computed) {
                            return
                        }

                        node.value = buildReplacementMeta(pathProp, node.value, id, locationMap)
                        changed = true
                    }
                },
            })

            if (!changed) return null

            const out = generate(ast, {}, code)
            return { code: out.code, map: null }
        },

        generateBundle() {
            const outDir = path.resolve(config.root, config.build.outDir)
            const outFile = path.join(outDir, "location-map.json")

            // Ensure output directory exists
            if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir, { recursive: true })
            }

            // Persist full location registry for diagnostics/analytics
            fs.writeFileSync(outFile, JSON.stringify(locationMap, null, 2), "utf8")
        },
    }
}

/**
 * Build replacement object and register metadata in locationMap
 */
function buildReplacementMeta(
    pathRef: NodePath<any>,
    idNode: t.Identifier,
    fileId: string,
    locationMap: Record<string, FullMeta>,
): t.ObjectExpression {
    const loc = idNode.loc ?? pathRef.node.loc
    const line = loc?.start.line ?? 0
    const column = loc?.start.column ?? 0

    const locationId = createHash(`${fileId}:${line}:${column}`)
    const { module, panel } = extractPathMeta(fileId)
    const moduleVersion = readModuleVersion(fileId)

    const className = findClassName(pathRef)
    const functionName = findFunctionName(pathRef)

    const runtimeMeta: RuntimeMeta = {
        locationId,
        module,
        moduleVersion,
        file: fileId,
        line,
        column,
    }

    locationMap[locationId] = {
        ...runtimeMeta,
        className,
        functionName,
        panel,
    }

    // Return runtime payload including file/line/column
    return t.objectExpression([
        t.objectProperty(t.identifier("locationId"), t.stringLiteral(locationId)),
        t.objectProperty(t.identifier("module"), t.stringLiteral(module)),
        t.objectProperty(t.identifier("moduleVersion"), t.stringLiteral(moduleVersion)),
        t.objectProperty(t.identifier("file"), t.stringLiteral(fileId)),
        t.objectProperty(t.identifier("line"), t.numericLiteral(line)),
        t.objectProperty(t.identifier("column"), t.numericLiteral(column)),
    ])
}

/**
 * Create short deterministic hash for location identity
 */
function createHash(input: string): string {
    return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12)
}

/**
 * Extract module/panel based on Plugins directory convention
 */
function extractPathMeta(file: string): { module: string; panel: string } {
    const normalized = file.split(path.sep).join("/")
    const parts = normalized.split("/")

    const pluginsIdx = parts.indexOf("Plugins")
    if (pluginsIdx !== -1) {
        return {
            module: parts[pluginsIdx + 1] ?? "",
            panel: parts[pluginsIdx + 2] ?? "",
        }
    }

    const coreIdx = parts.indexOf("core")
    if (coreIdx !== -1) return { module: "core", panel: "" }

    return { module: "", panel: "" }
}

/**
 * Read nearest package.json while walking up from file path
 */
function readNearestPackageJson(startFile: string): Record<string, unknown> | null {
    try {
        let current = path.dirname(startFile)
        while (current !== path.dirname(current)) {
            const pkgPath = path.join(current, "package.json")
            if (fs.existsSync(pkgPath)) {
                return JSON.parse(fs.readFileSync(pkgPath, "utf8"))
            }
            current = path.dirname(current)
        }
        return null
    } catch {
        return null
    }
}

/**
 * Resolve module version from nearest package.json
 */
function readModuleVersion(filePath: string): string {
    const pkg = readNearestPackageJson(filePath)
    const v = pkg?.["version"]
    return typeof v === "string" ? v : ""
}

/**
 * Find nearest enclosing class name
 */
function findClassName(pathRef: NodePath<any>): string | null {
    const cls = pathRef.findParent((p) => p.isClassDeclaration()) as NodePath<t.ClassDeclaration> | null
    return cls?.node.id?.name ?? null
}

/**
 * Find nearest enclosing function/method name
 */
function findFunctionName(pathRef: NodePath<any>): string | null {
    const fn = pathRef.findParent(
        (p) => p.isFunctionDeclaration() || p.isClassMethod() || p.isObjectMethod(),
    )
    if (!fn) return null
    const n: any = fn.node
    if (n.key?.name) return n.key.name
    if (n.id?.name) return n.id.name
    return null
}
