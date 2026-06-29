/**
 * Provides authenticated user id
 */
export class UserContext {

    private static resolver?: () => string | undefined

    static register(
        resolver: () => string | undefined
    ) {

        this.resolver = resolver

    }

    static getUserId(): string | undefined {

        if (!this.resolver) {
            return undefined
        }

        return this.resolver()

    }

}
