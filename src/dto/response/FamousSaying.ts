


export class FamousSaying{
    private famousSaying:string;
    private writer:string;

    constructor(famousSaying:string, writer:string){
        this.setFamousSaying(famousSaying);
        this.setWriter(writer);
    }

    public static of(famousSaying:string, writer:string){
        return new FamousSaying(famousSaying, writer);
    }


    private setFamousSaying(famousSaying:string){
        this.famousSaying=famousSaying;
    }

    private setWriter(writer:string){
        this.writer=writer;
    }
}