import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];
        const quality = parseInt(formData.get('quality') as string, 10);

        if (!files?.length || isNaN(quality)) {
            return NextResponse.json(
                { error: 'Files and quality are required' },
                { status: 400 }
            );
        }

        const zip = new JSZip();

        await Promise.all(
            files.map(async (file) => {
                const buffer = Buffer.from(await file.arrayBuffer());
                const compressedBuffer = await sharp(buffer)
                    .jpeg({ quality: quality })
                    .toBuffer();

                zip.file(`compressed-${file.name}`, compressedBuffer);
            })
        );

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        return new NextResponse(zipBuffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename=compressed-images.zip',
            },
        });
    } catch (error) {
        console.error('Error compressing images:', error);
        return NextResponse.json(
            { error: 'Error compressing images' },
            { status: 500 }
        );
    }
}