import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions): string =>{
    return jwt.sign(payload, secret, 
        { expiresIn } as jwt.SignOptions);
}

export const jwtUtils = {
    createToken
}