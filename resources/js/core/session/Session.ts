/**
 * Manages user session identifier
 */
export class Session {

    private static sessionId: string

    static getId(): string {

        if (!this.sessionId) {

            const existing = sessionStorage.getItem("sessionId")

            if (existing) {
                this.sessionId = existing
            }
            else {

                this.sessionId = crypto.randomUUID()

                sessionStorage.setItem(
                    "sessionId",
                    this.sessionId
                )
            }

        }

        return this.sessionId
    }

}
