import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import JSZip from 'jszip'

export async function GET() {
  return NextResponse.json({
    status: 200,
    message: 'Welcome to Experiment',
  })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    const format = formData.get('format') as string

    if (!files?.length || !format) {
      return NextResponse.json(
        { error: 'Files and format are required' },
        { status: 400 }
      )
    }

    const zip = new JSZip()

    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = file.name.split('.')[0]

        const processedBuffer = await sharp(buffer)
          .toFormat(format as keyof sharp.FormatEnum)
          .toBuffer()

        zip.file(`${fileName}.${format}`, processedBuffer)

        return {
          originalName: file.name,
          newName: `${fileName}.${format}`,
        }
      })
    )

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=converted-images.zip`,
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
