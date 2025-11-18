import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';
import { AuthGuard } from '../guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Proxy')
@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('auth/*')
  @ApiOperation({ summary: 'Proxy to Auth Service' })
  async authProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest('auth', req, res);
  }

  @All('missions/*')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Proxy to Mission Service' })
  async missionProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest('mission', req, res);
  }

  @All('tracking/*')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Proxy to Tracking Service' })
  async trackingProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest('tracking', req, res);
  }

  @All('payments/*')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Proxy to Payment Service' })
  async paymentProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest('payment', req, res);
  }

  @All('marketplace/*')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Proxy to Marketplace Service' })
  async marketplaceProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest('marketplace', req, res);
  }

  @All('documents/*')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Proxy to File Service' })
  async documentProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest('file', req, res);
  }
}
