export class File {
    sdp: string;
    session: {
        type: string;
        audio: {
            input: {
                format: string;
                type: string;
            },
        }
    };
}
