import { NextResponse } from 'next/server';
import { fetchProfile, fetchPosts } from '@/lib/instagram';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'alinnarosee';

  const [profile, posts] = await Promise.all([
    fetchProfile(username),
    fetchPosts(username)
  ]);

  return NextResponse.json({ profile, posts });
}
