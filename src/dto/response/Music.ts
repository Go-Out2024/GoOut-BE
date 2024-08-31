

export class Music{


    // private music: string;
    // private singer: string;
    // private url:string;

    private videoUrl:string;
    private videoImage:string
    private videoSinger:string
    private videoTitle:string


    constructor(videoUrl:string, videoImage:string, videoSinger:string, videoTitle:string){
        this.setVideoUrl(videoUrl);
        this.setVideoImage(videoImage);
        this.setVideoSinger(videoSinger);
        this.setVideoTitle(videoTitle);
    }

    public static of(videoUrl:string, videoImage:string, videoSinger:string, videoTitle:string){
        return new Music(videoUrl, videoImage, videoSinger, videoTitle);
    }



    private setVideoUrl(url: string) {
        if (url === null) throw new Error(`${__dirname} : url 값이 존재하지 않습니다.`);
        this.videoUrl = url;
    }

 
    private setVideoImage(image: string) {
        if (image === null) throw new Error(`${__dirname} : image 값이 존재하지 않습니다.`);
        this.videoImage = image;
    }

  
    private setVideoSinger(singer: string) {
        if (singer === null) throw new Error(`${__dirname} : singer 값이 존재하지 않습니다.`);
        this.videoSinger = singer;
    }

 
    private setVideoTitle(title: string) {
        if (title === null) throw new Error(`${__dirname} : title 값이 존재하지 않습니다.`);
        this.videoTitle = title;
    }
}