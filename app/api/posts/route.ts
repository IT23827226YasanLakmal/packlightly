import { NextRequest, NextResponse } from 'next/server';

// Mock posts data for development
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

export async function GET() {
  try {
    return NextResponse.json(mockPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, image, author, ownerId } = await request.json();

    if (!content || !author || !ownerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = {
      id: Date.now().toString(),
      author,
      avatar: '/images/PackLightlyLogo.svg',
      content,
      image: image || null,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      likedBy: [],
      ownerId
    };

    mockPosts.unshift(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}