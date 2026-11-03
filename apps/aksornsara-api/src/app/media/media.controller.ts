import { Controller, Post, Body } from '@nestjs/common';

@Controller('admin/media')
export class MediaController {
  @Post('upload')
  uploadMedia(@Body() body: any) {
    // Generates a mock or GCS CDN URL for uploaded media
    const uniqueId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const url = body?.url || `https://cdn.aksornsara.com/uploads/2026/${uniqueId}.webp`;

    return {
      success: true,
      data: {
        url,
        file_name: `${uniqueId}.webp`,
        file_size: 284520,
        mime_type: 'image/webp',
      },
      message: 'Image uploaded successfully',
    };
  }
}

