import { NextRequest, NextResponse } from 'next/server';

import conversationsData from '@/data/gemini_convertions_data.json'

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const messages = conversationsData.conversations.slice(start, end);
    const hasMore = end < conversationsData.conversations.length;

    return NextResponse.json({ messages, hasMore });
}
