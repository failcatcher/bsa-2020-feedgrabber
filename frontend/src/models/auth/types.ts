export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
}

export interface IRegisterData {
    email: string;
    password: string;
    username: string;
    companyName: string;
}

export interface ILoginData {
    password: string;
    username: string;
}
