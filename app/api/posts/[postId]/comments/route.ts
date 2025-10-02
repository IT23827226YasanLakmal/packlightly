import { NextRequest, NextResponse } from 'next/server';

// Mock comments data (in a real app, this would be in a database)
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const mockComments: { [postId: string]: Comment[] } = {
  '1': [
    {
      id: '1',
      author: 'travel_enthusiast',
      content: 'This is so helpful! Thanks for sharing!',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    }
  ],
  '2': [
    {
      id: '2',
      author: 'eco_warrior',
      content: 'Great tips! I always forget my reusable bottle.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const comments = mockComments[postId] || [];
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { content, author } = await request.json();
    const { postId } = params;

    if (!content || !author) {
      return NextResponse.json(
        { error: 'Content and author are required' },
        { status: 400 }
      );
    }

    const newComment = {
      id: Date.now().toString(),
      author,
      content,
      timestamp: new Date().toISOString(),
    };

    if (!mockComments[postId]) {
      mockComments[postId] = [];
    }

    mockComments[postId].push(newComment);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}