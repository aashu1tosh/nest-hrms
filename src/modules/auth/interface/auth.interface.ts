import { Role } from "src/constant/enum";

export interface IJwtPayload {
    id?: string;
    role?: Role;
    companyId?: string;
    employeeId?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
