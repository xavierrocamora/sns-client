export class Follow{
    constructor(
        public _id: string,
        public user: string,
        public followedUser: string
    ){}
}