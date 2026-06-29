/**
 * Build W3C traceparent header value.
 * Returns null if traceId or spanId is invalid.
 */
export function buildTraceParent(
    traceId?: string,
    spanId?: string
): string | null {

    if (!traceId || !spanId) return null

    const version = "00"
    const flags = "01"

    const normalizedTraceId = traceId.replace(/-/g, "").toLowerCase()
    const normalizedSpanId = spanId.replace(/-/g, "").toLowerCase()

    const isValidTraceId =
        /^[0-9a-f]{32}$/.test(normalizedTraceId) &&
        !/^0{32}$/.test(normalizedTraceId)

    const isValidSpanId =
        /^[0-9a-f]{16}$/.test(normalizedSpanId) &&
        !/^0{16}$/.test(normalizedSpanId)

    if (!isValidTraceId || !isValidSpanId) {
        return null
    }

    return `${version}-${normalizedTraceId}-${normalizedSpanId}-${flags}`
}
