import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get the secret from query params
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    
    // Check for secret to confirm this is a valid request
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Get the webhook payload from Sanity
    const body = await request.json();
    
    console.log('Webhook received from Sanity:', body);

    // Revalidate all blog-related paths
    revalidatePath('/blogs', 'page');           // Blog listing page
    revalidatePath('/blogs/[...slug]', 'page'); // All blog detail pages
    revalidatePath('/', 'page');                // Home page (if it shows blogs)

    console.log('Successfully revalidated blog pages');

    return NextResponse.json({ 
      revalidated: true,
      now: Date.now(),
      message: 'Blog pages revalidated successfully'
    });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}

// Also support GET requests for manual testing
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate all blog-related paths
    revalidatePath('/blogs', 'page');
    revalidatePath('/blogs/[...slug]', 'page');
    revalidatePath('/', 'page');

    return NextResponse.json({ 
      revalidated: true,
      now: Date.now(),
      message: 'Manual revalidation successful'
    });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}

