export interface User {
    id: number;
    name: string;
    username: string;
    avatar: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
