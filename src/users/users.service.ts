import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt'
import { config } from '../config/index'


@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const user = await prisma.user.findUnique({
      where: {
        email: createUserDto.email
      }
    })

    if (user) {
      throw new ConflictException('User already exists!')
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, Number(config.bcrypt_salt_rounds))

    const newUser = await prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword
      }
    })


    if (!newUser) {
      throw new ConflictException('Failed to create user!')
    }
    const userProfile = await prisma.profile.create({
      data: {
        user_id: newUser.id,
        profile_photo: createUserDto.profile_photo
      }
    })
    return userProfile
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await prisma.profile.findUnique({
      where: {
        id: id
      }
    })

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
