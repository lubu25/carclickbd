import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'product.json');
const backupDirPath = path.join(process.cwd(), 'backups');

export async function POST(req: Request) {
  try {
    const { filename } = await req.json();
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    
    const backupFilePath = path.join(backupDirPath, filename);
    
    if (!fs.existsSync(backupFilePath)) {
      return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
    }
    
    fs.copyFileSync(backupFilePath, dataFilePath);
    
    return NextResponse.json({ message: 'Restore successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
  }
}
