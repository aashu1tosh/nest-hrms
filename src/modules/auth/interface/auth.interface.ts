import { Role } from "src/constant/enum";

export interface IJwtPayload {
    id?: string;
    role?: Role;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
