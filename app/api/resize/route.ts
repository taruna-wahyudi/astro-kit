import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import JSZip from 'jszip'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    const width = Number(formData.get('width'))
    const height = Number(formData.get('height'))
    const maintainAspectRatio = formData.get('maintainAspectRatio') === 'true'

    if (!files?.length || !width || !height) {
      return NextResponse.json(
        { error: 'Files, width, and height are required' },
        { status: 400 }
      )
    }

    const zip = new JSZip()
    let progress = 0
    const totalFiles = files.length

    const processedFiles = await Promise.all(
      files.map(async (file, index) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = file.name.split('.')[0]
        const extension = file.name.split('.').pop()

        let resizeOptions: sharp.ResizeOptions = {
          width,
          height,
        }

        if (maintainAspectRatio) {
          resizeOptions.fit = 'inside'
        }

        const processedBuffer = await sharp(buffer)
          .resize(resizeOptions)
          .toBuffer()

        zip.file(`${fileName}-resized.${extension}`, processedBuffer)
        progress = Math.round(((index + 1) / totalFiles) * 100);
        console.log(`Processing: ${progress}%`);

        return {
          originalName: file.name,
          newName: `${fileName}-resized.${extension}`,
        }
      })
    )

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=resized-images.zip`,
      },
    })
  } catch (error) {
    console.error('Error processing images:', error)
    return NextResponse.json(
      { error: 'Error processing images' },
      { status: 500 }
    )
  }
}
