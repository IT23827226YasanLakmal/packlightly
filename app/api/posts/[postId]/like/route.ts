import { NextRequest, NextResponse } from 'next/server';

// Mock posts data (in a real app, this would be in a database)
const mockPosts = [
  {
    id: '1',
    author: 'jane_doe',
    avatar: '/images/PackLightlyLogo.svg',
    content: 'Just packed for my weekend trip using the smart packing suggestions! 🎒 PackLightly made it so easy to know exactly what to bring.',
    image: null,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 12,
    comments: 3,
    likedBy: ['user1', 'user2'],
    ownerId: 'jane_doe'
  },
  {
    id: '2',
    author: 'travel_guru',
    avatar: '/images/PackLightlyLogo.svg',
    content: 'Eco-friendly packing tips: Always pack reusable water bottles and avoid single-use items! 🌱 #SustainableTravel',
    image: null,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 24,
    comments: 7,
    likedBy: ['user3', 'user4', 'user5'],
    ownerId: 'travel_guru'
  },
  {
    id: '3',
    author: 'adventure_seeker',
    avatar: '/images/PackLightlyLogo.svg',
    content: 'My 7-day Europe trip with just a carry-on! Thanks to PackLightly\'s compression suggestions. ✈️',
    image: '/images/product-placeholder.svg',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: 45,
    comments: 12,
    likedBy: ['user1', 'user6'],
    ownerId: 'adventure_seeker'
  }
];

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = await request.json();
    const { postId } = params;

    console.log('[API] Like request:', { postId, userId });

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find the post
    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user already liked the post
    if (post.likedBy.includes(userId)) {
      console.log('[API] User already liked this post');
      return NextResponse.json(
        { error: 'User already liked this post' },
        { status: 400 }
      );
    }

    // Add user to likedBy array
    post.likedBy.push(userId);
    post.likes = post.likedBy.length;

    console.log('[API] Post liked successfully:', { postId, likedBy: post.likedBy });

    return NextResponse.json(post);
  } catch (error) {
    console.error('[API] Error liking post:', error);
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    );
  }
}