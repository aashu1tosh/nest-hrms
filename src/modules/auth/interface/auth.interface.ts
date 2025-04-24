import { Role } from "src/constant/enum";

export interface UserPayload {
    id: string;
    role: Role;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
