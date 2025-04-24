import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { Environment } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { successResponse } from 'src/helper/successResponse';
import { CreateAuthDTO, LoginDTO } from './dto/auth.dto';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private configService: ConfigService,
  ) { }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({ data });

    // Set access token as HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === Environment.PRODUCTION, // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === Environment.PRODUCTION,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    return successResponse(Message.loginSuccessfully);
  }

  @Post('/register')
  async create(@Body() data: CreateAuthDTO) {
    await this.authService.create({ data });
    return successResponse(Message.created);
  }
}

