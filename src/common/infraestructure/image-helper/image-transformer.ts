import { Readable } from "stream"

export class ImageTransformer
{
    constructor (){}

    async base64ToFile ( base64: string ): Promise<Express.Multer.File>
    {
        try{        
            const arr = base64.split( ',' )
        const bstr = atob( arr[ arr.length - 1 ] )
        let n = bstr.length
        const u8arr = new Uint8Array( n )
        while ( n-- )
        {
            u8arr[ n ] = bstr.charCodeAt( n )
        }
        const file = new File( [ u8arr ], "image.png", { type: "image"} )

        // Crear un objeto simulado de multer file 
        const multerFile: Express.Multer.File = { 
            fieldname: 'file', 
            originalname: 'image.png', 
            encoding: '7bit',
            mimetype: 'mime',
            size: u8arr.length,
            buffer: Buffer.from(u8arr),
            destination: '',
            filename: '',
            path: '',
            stream: Readable.from(u8arr), 
        };
        return multerFile
        }catch(e){
            console.log(e)
        } 
    }

    async base64ToVideo ( base64: string ): Promise<File>
    {
        const arr = base64.split( ',' )
        const mime = arr[ 0 ].match( /:(.*?);/ )[ 1 ]
        const bstr = atob( arr[ arr.length - 1 ] )
        let n = bstr.length
        const u8arr = new Uint8Array( n )
        while ( n-- )
        {
            u8arr[ n ] = bstr.charCodeAt( n )
        }
        const file = new File( [ u8arr ], "video.mp4", { type: mime} )
        return file
    }
}