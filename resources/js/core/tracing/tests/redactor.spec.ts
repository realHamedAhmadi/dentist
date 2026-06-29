import { describe, it, expect } from "vitest"
import { KeyBasedRedactor } from "@/core/tracing/redaction/keyBasedRedactor"

describe("KeyBasedRedactor", () => {
    it("should redact sensitive keys", () => {
        const redactor = new KeyBasedRedactor(["password", "token", "authorization"])

        const input = {
            user: "ali",
            password: "123456",
            nested: {
                token: "abcd",
            },
        }

        const out = redactor.redact(input as any)

        expect(out.password).toBe("[REDACTED]")
        expect(out.nested.token).toBe("[REDACTED]")
        expect(out.user).toBe("ali")
    })
})
