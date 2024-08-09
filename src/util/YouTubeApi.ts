import { Service } from "typedi";
import axios from 'axios';
import { envs } from '../config/environment.js';



@Service()
export class YouTubeApi{

    private readonly YOUTUBE_URL="https://www.googleapis.com/youtube/v3/search?part=snippet";
    async bringVideo(searchword: string) {
        try {
            const response = await axios.get(`${this.YOUTUBE_URL}&q=${encodeURIComponent(searchword)}&key=${envs.apikey.youtubeapikey}&maxResults=1`);
            return response.data.items[0];
        } catch (error) {
            console.error('유튜브 조회 실패:', error);
            throw new Error('유튜브 조회 실패:');
        }
    }

    async getVideoUrl(videoId: string): Promise<string> {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
}
