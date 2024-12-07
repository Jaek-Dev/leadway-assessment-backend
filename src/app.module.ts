import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VirtualAccountModule } from './virtual-account/virtual-account.module';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { number, object, string } from 'yup';
import { AuthService } from './auth/auth.service';
import { config } from 'dotenv';

config();
@Module({
  imports: [
    UserModule,
    VirtualAccountModule,
    TransactionModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: object().shape({
        JWT_SECRET: string().required(),
        DB_HOST: string().required(),
        DB_USER: string().required(),
        DB_PORT: number().default(5432),
        DB_PASSWORD: string().default(''),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*.{ts,js}'],
      migrationsTableName: 'migrations',
      synchronize: true,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
