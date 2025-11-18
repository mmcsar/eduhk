import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  
  private readonly serviceUrls = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    mission: process.env.MISSION_SERVICE_URL || 'http://localhost:3002',
    tracking: process.env.TRACKING_SERVICE_URL || 'http://localhost:3003',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
    marketplace: process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:3005',
    file: process.env.FILE_SERVICE_URL || 'http://localhost:3006',
  };

  constructor(private readonly httpService: HttpService) {}

  async proxyRequest(service: string, req: Request, res: Response) {
    const serviceUrl = this.serviceUrls[service];
    if (!serviceUrl) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    // Remove service prefix from path
    const path = req.path.replace(`/${service}`, '');
    const url = `${serviceUrl}${path}`;

    // Forward headers (excluding host)
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['content-length'];

    try {
      this.logger.debug(`Proxying ${req.method} ${url}`);

      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url,
          headers,
          data: req.body,
          params: req.query,
          timeout: 30000,
          maxRedirects: 0,
        })
      );

      // Forward response
      res.status(response.status);
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      res.send(response.data);
    } catch (error) {
      this.logger.error(`Proxy error for ${service}: ${error.message}`);
      
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else if (error.code === 'ECONNREFUSED') {
        throw new HttpException('Service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      } else {
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
