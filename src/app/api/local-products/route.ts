import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'product.json');

export async function GET() {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const products = JSON.parse(fileData);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ message: 'Products updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
