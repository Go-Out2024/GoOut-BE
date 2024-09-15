import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repository/User.Repository';
import jwt from 'jsonwebtoken'
import {RedisService} from './Redis.Service'
import { KakaoApiService } from './KakaoApi.Service';
import { FirebaseTokenRepository } from '../repository/FirebaseToken.Repository';



@Service()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(FirebaseTokenRepository) private firebaseTokenRepository: FirebaseTokenRepository,
        private kakaoApiservice: KakaoApiService,
        private redisService: RedisService
    ) {}

    async loginWithKakao(accessToken: string):Promise< {
        accessToken: string;
        refreshToken: string;
    }> {
        const userInfo = await this.kakaoApiservice.bringUserInfo(accessToken);
        let user = await this.userRepository.findByKakaoId(userInfo.kakaoId);
        if(!user) {
            user = await this.userRepository.createUser({
                numbers: userInfo.kakaoId,
                email:userInfo.email
        });
        }
        const tokens = this.generateJwtTokens(user.id);
        await this.redisService.setValue(tokens.refreshToken, String(user.id));
        await this.redisService.getValue(String(user.id));
        return tokens;

    }

    private generateJwtTokens(userId: number) {
        const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d'});
        const refreshToken = jwt.sign({ id: userId}, process.env.JWT_REFRESH_SECRET, { expiresIn: '2d'});
        return { accessToken, refreshToken};
    }

    async logout(refreshToken: string, firebaseToken: string) {
        const decodedToken: any = jwt.decode(refreshToken);
        if (!decodedToken || typeof decodedToken !== 'object') {
            throw new Error('Invalid token');
        }

        console.log(decodedToken);
    
        const userId = decodedToken.id;
        if (!userId) {
            throw new Error('User ID not found in token');
        }
    
        await this.redisService.deleteValue(userId);
        await this.firebaseTokenRepository.deleteTokensByUserId(userId, firebaseToken);
    }

}
