import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ApiMessage } from 'src/common/decorator/api-response.decorator';
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { Environment, Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { CreateAuthAdminDTO, LoginDTO } from './dto/auth.dto';
import { AuthService } from './service/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('/is-authorize-me')
  @ApiOperation({ summary: 'Check if I am authorized' })
  @Authentication()
  async isAuthorizeMe(@User('id') userId: string) {
    return this.authService.me(userId);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiMessage(Message.loginSuccessfully)
  async login(
    @Body() data: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login({
      data,
    });

    // Set access token as HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure:
        this.configService.get<string>('NODE_ENV') === Environment.PRODUCTION, // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:
        this.configService.get<string>('NODE_ENV') === Environment.PRODUCTION,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
  }

  @Post('/register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register an ADMIN (Only allowed by sudo admin)' })
  @Authentication()
  @Authorization([Role.SUDO_ADMIN])
  @ApiMessage(Message.created)
  async create(@Body() data: CreateAuthAdminDTO) {
    await this.authService.create({ data });
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiMessage('Authentication token refreshed successfully')
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken as string;
    if (!refreshToken) throw new UnauthorizedException(Message.notAuthorized);

    const { accessToken, refreshToken: newRefreshToken } =
      this.authService.refreshToken({ refreshToken });

    // Set access token as HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure:
        this.configService.get<string>('NODE_ENV') === Environment.PRODUCTION, // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure:
        this.configService.get<string>('NODE_ENV') === Environment.PRODUCTION,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Authentication()
  @ApiMessage(Message.logoutSuccessfully)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
