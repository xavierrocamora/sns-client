export class Message{
    constructor(
        public _id: string,
        public sender: string,
        public receiver: string,
        public text: string,
        public created_at: string,
        public read: string
    ){}
}