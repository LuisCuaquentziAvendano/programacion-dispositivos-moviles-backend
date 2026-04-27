import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UserDbService } from 'src/database/user-db.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { User } from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getFirebaseAuth } from './firebase-admin';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userDbService: UserDbService,
  ) {
    super();
  }

  async validate(firebaseIdToken: string): Promise<User> {
    let decodedToken: DecodedIdToken;
    try {
      const firebaseAuth = getFirebaseAuth(this.configService);
      decodedToken = await firebaseAuth.verifyIdToken(firebaseIdToken, true);
      await firebaseAuth.getUser(decodedToken.uid);
    } catch {
      throw new UnauthorizedException();
    }

    const payload: JwtPayloadDto = { uid: decodedToken.uid };
    let user = await this.userDbService.getByUid(payload.uid);

    if (!user) {
      if (decodedToken.email) {
        const existingUserByEmail = await this.userDbService.getByEmail(
          decodedToken.email,
        );
        if (existingUserByEmail && existingUserByEmail.uid !== payload.uid)
          throw new UnauthorizedException();
      }
      user = await this.userDbService.create({
        uid: payload.uid,
        email: decodedToken.email,
        name: decodedToken.name as string,
      });
    }

    return user;
  }
}
