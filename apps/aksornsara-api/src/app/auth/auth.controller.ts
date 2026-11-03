import { Controller, Post, Get, Body } from '@nestjs/common';

@Controller()
export class AuthController {
  @Post('auth/login')
  login(@Body() body: { id_token?: string }) {
    return {
      success: true,
      data: {
        user: {
          id: 1,
          email: 'editor@aksornsara.com',
          full_name: 'สมชาย สารบรรณ',
          pen_name: 'พิรุณสาร',
          role: 'editor',
          avatar_url: 'https://cdn.aksornsara.com/avatars/u1.webp',
        },
      },
      message: 'Login successful',
    };
  }

  @Get('admin/me')
  getMe() {
    return {
      success: true,
      data: {
        id: 1,
        email: 'editor@aksornsara.com',
        full_name: 'สมชาย สารบรรณ',
        pen_name: 'พิรุณสาร',
        bio: 'กองบรรณาธิการฝ่ายวรรณกรรมและศิลปวัฒนธรรม',
        avatar_url: 'https://cdn.aksornsara.com/avatars/u1.webp',
        role: 'editor',
        created_at: '2024-01-15T08:00:00Z',
      },
    };
  }

  @Post('auth/logout')
  logout() {
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Get('health')
  health() {
    return {
      success: true,
      data: {
        status: 'healthy',
        service: 'aksornsara-api',
        version: '1.0.0',
      },
    };
  }
}

