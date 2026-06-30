import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { jwtUtils } from '../utils/jwt';

@Injectable()
export class AuthService {
  async create(createAuthDto: CreateAuthDto) {

    const user = await prisma.user.findFirst({
      where: { email: createAuthDto.email }
    })

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    const isValidPassword = bcrypt.compareSync(createAuthDto.password, user.password);
    if (!isValidPassword) {
      throw new NotFoundException('Invalid password!')
    }

    const jwtPayload = { id: user.id, email: user.email, role: user.role, name: user.name }

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret!, config.jwt_access_expire as jwt.SignOptions);
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret!, config.jwt_refresh_expire as jwt.SignOptions);

    return { accessToken, refreshToken };
  }


  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
