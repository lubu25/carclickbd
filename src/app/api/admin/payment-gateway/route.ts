import { NextResponse } from 'next/server';
import { getEpsConfig, saveEpsConfig } from '@/lib/epsConfig';

export async function GET() {
  try {
    const config = await getEpsConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payment config' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const config = await getEpsConfig();
    
    // Merge new config while retaining defaults for anything undefined
    const newConfig = { ...config, ...body };
    await saveEpsConfig(newConfig);
    
    return NextResponse.json({ message: 'Configuration saved successfully', config: newConfig });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save payment config' }, { status: 500 });
  }
}
