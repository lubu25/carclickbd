import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'product.json');
const backupDirPath = path.join(process.cwd(), 'backups');

export async function POST() {
  try {
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath);
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(backupDirPath, `product_backup_${timestamp}.json`);
    
    fs.copyFileSync(dataFilePath, backupFilePath);
    
    return NextResponse.json({ message: 'Backup created successfully', backupFile: `product_backup_${timestamp}.json` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(backupDirPath)) {
      return NextResponse.json([]);
    }
    const files = fs.readdirSync(backupDirPath).filter(f => f.endsWith('.json'));
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 });
  }
}
