export interface User {
    id: string;
    name: string;
    username: string;
    role: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
