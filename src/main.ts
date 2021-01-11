import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cron from 'node-cron';
import * as fs from 'fs';
import * as path from 'path';

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
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
