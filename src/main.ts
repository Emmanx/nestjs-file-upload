import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cron from 'node-cron';
import * as fs from 'fs';
import * as path from 'path';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  cron.schedule('0 0 */1 * * *', () => {
    console.log('DELETING FILES.......');

    fs.readdir('images', (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      for (const file of files) {
        fs.unlink(path.join('images', file), (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });
      }
    });
  });

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 20, // limit each IP to 20 requests per windowMs
    }),
  );

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
