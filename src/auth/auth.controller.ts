import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(
    @Body() createAuthDto: CreateAuthDto,
   @Res({passthrough: true}) res: Response ) {

    const { accessToken, refreshToken } = await this.authService.create(createAuthDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000  * 60 *60 *24
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000  * 60 *60 *24 * 7
    })

    res.json({
      status: 'success',
      message: 'User logged in successfully',
    })
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
