import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers } = req;
    
    console.log('\n📨 Incoming Request:');
    console.log(`   Method: ${method}`);
    console.log(`   URL: ${originalUrl}`);
    console.log(`   Origin: ${headers.origin || 'no-origin'}`);
    console.log(`   User-Agent: ${headers['user-agent']?.substring(0, 50)}...`);
    console.log(`   ngrok-skip: ${headers['ngrok-skip-browser-warning']}`);
    
    // Log response
    const originalSend = res.send;
    res.send = function(data) {
      console.log(`   ✅ Response: ${res.statusCode}`);
      return originalSend.call(this, data);
    };

    next();
  }
}
