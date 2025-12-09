import { NextRequest, NextResponse } from 'next/server';

// Mock data for skills - in a real app, this would come from a database
const mockSkills = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    priority: 5,
    description: 'Learn the basics of JavaScript programming language including variables, functions, and control structures.',
    slug: 'javascript-fundamentals',
    seo_title: 'JavaScript Fundamentals - Learn JS Basics',
    seo_description: 'Master JavaScript fundamentals including variables, functions, and control structures for web development.',
    seo_keywords: 'JavaScript, programming, basics, web development',
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2023-10-15T14:30:00Z'
  },
  {
    id: 2,
    title: 'React Development',
    priority: 8,
    description: 'Master React.js for building modern web applications with components, state management, and hooks.',
    slug: 'react-development',
    seo_title: 'React Development - Build Modern Web Apps',
    seo_description: 'Learn React.js to create dynamic web applications with components, state management, and hooks.',
    seo_keywords: 'React, JavaScript, web development, components, hooks',
    created_at: '2023-09-15T09:00:00Z',
    updated_at: '2023-10-20T16:45:00Z'
  },
  {
    id: 3,
    title: 'Node.js Backend',
    priority: 7,
    description: 'Build server-side applications with Node.js, Express, and database integration.',
    slug: 'nodejs-backend',
    seo_title: 'Node.js Backend Development - Server-Side Apps',
    seo_description: 'Develop backend applications using Node.js, Express framework, and database integration.',
    seo_keywords: 'Node.js, backend, Express, server-side, database',
    created_at: '2023-08-20T11:30:00Z',
    updated_at: '2023-10-10T13:20:00Z'
  },
  {
    id: 4,
    title: 'Python Data Science',
    priority: 6,
    description: 'Explore data analysis and machine learning with Python, pandas, and scikit-learn.',
    slug: 'python-data-science',
    seo_title: 'Python Data Science - Data Analysis & ML',
    seo_description: 'Dive into data science with Python, using pandas and scikit-learn for analysis and machine learning.',
    seo_keywords: 'Python, data science, pandas, scikit-learn, machine learning',
    created_at: '2023-07-10T08:15:00Z',
    updated_at: '2023-09-25T12:00:00Z'
  },
  {
    id: 5,
    title: 'UI/UX Design',
    priority: 4,
    description: 'Create beautiful and user-friendly interfaces with modern design principles and tools.',
    slug: 'ui-ux-design',
    seo_title: 'UI/UX Design - Create User-Friendly Interfaces',
    seo_description: 'Learn UI/UX design principles to build intuitive and visually appealing user interfaces.',
    seo_keywords: 'UI/UX, design, user interface, user experience, design principles',
    created_at: '2023-06-05T14:20:00Z',
    updated_at: '2023-08-30T10:45:00Z'
  },
  {
    id: 6,
    title: 'Database Management',
    priority: 9,
    description: 'Learn SQL and NoSQL databases, query optimization, and data modeling techniques.',
    slug: 'database-management',
    seo_title: 'Database Management - SQL & NoSQL',
    seo_description: 'Master database management with SQL and NoSQL, including query optimization and data modeling.',
    seo_keywords: 'database, SQL, NoSQL, query optimization, data modeling',
    created_at: '2023-05-12T16:00:00Z',
    updated_at: '2023-10-25T11:30:00Z'
  },
  {
    id: 7,
    title: 'Cloud Computing',
    priority: 3,
    description: 'Deploy and manage applications on cloud platforms like AWS, Azure, and Google Cloud.',
    slug: 'cloud-computing',
    seo_title: 'Cloud Computing - Deploy Apps on Cloud',
    seo_description: 'Learn cloud computing to deploy and manage applications on AWS, Azure, and Google Cloud.',
    seo_keywords: 'cloud computing, AWS, Azure, Google Cloud, deployment',
    created_at: '2023-04-18T13:45:00Z',
    updated_at: '2023-07-15T15:20:00Z'
  },
  {
    id: 8,
    title: 'DevOps Practices',
    priority: 7,
    description: 'Implement CI/CD pipelines, containerization with Docker, and infrastructure as code.',
    slug: 'devops-practices',
    seo_title: 'DevOps Practices - CI/CD & Docker',
    seo_description: 'Implement DevOps practices including CI/CD pipelines, Docker containerization, and infrastructure as code.',
    seo_keywords: 'DevOps, CI/CD, Docker, containerization, infrastructure as code',
    created_at: '2023-03-22T10:30:00Z',
    updated_at: '2023-09-18T09:15:00Z'
  },
  {
    id: 9,
    title: 'Mobile App Development',
    priority: 5,
    description: 'Build cross-platform mobile applications using React Native and Flutter.',
    slug: 'mobile-app-development',
    seo_title: 'Mobile App Development - React Native & Flutter',
    seo_description: 'Build cross-platform mobile apps with React Native and Flutter frameworks.',
    seo_keywords: 'mobile app, React Native, Flutter, cross-platform',
    created_at: '2023-02-14T12:00:00Z',
    updated_at: '2023-08-05T14:00:00Z'
  },
  {
    id: 10,
    title: 'Cybersecurity Basics',
    priority: 10,
    description: 'Understand fundamental security concepts, encryption, and best practices for secure coding.',
    slug: 'cybersecurity-basics',
    seo_title: 'Cybersecurity Basics - Secure Coding Practices',
    seo_description: 'Learn cybersecurity fundamentals including encryption and secure coding best practices.',
    seo_keywords: 'cybersecurity, encryption, secure coding, security concepts',
    created_at: '2023-01-08T09:45:00Z',
    updated_at: '2023-10-28T16:30:00Z'
  },
  {
    id: 11,
    title: 'API Design',
    priority: 6,
    description: 'Design and implement RESTful APIs with proper documentation and versioning.',
    slug: 'api-design',
    seo_title: 'API Design - RESTful APIs & Documentation',
    seo_description: 'Design and implement RESTful APIs with proper documentation and versioning strategies.',
    seo_keywords: 'API, RESTful, documentation, versioning',
    created_at: '2022-12-01T11:15:00Z',
    updated_at: '2023-06-20T13:45:00Z'
  },
  {
    id: 12,
    title: 'Version Control',
    priority: 8,
    description: 'Master Git and GitHub for collaborative software development and code management.',
    slug: 'version-control',
    seo_title: 'Version Control - Git & GitHub Mastery',
    seo_description: 'Master version control with Git and GitHub for collaborative software development.',
    seo_keywords: 'Git, GitHub, version control, collaborative development',
    created_at: '2022-11-10T15:30:00Z',
    updated_at: '2023-05-12T10:20:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Parse query parameters for pagination, sorting, filtering
    // 2. Query the database with appropriate filters
    // 3. Return paginated results

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let filteredSkills = mockSkills;

    // Apply search filter
    if (search) {
      filteredSkills = filteredSkills.filter(skill =>
        skill.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    filteredSkills.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSkills = filteredSkills.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedSkills,
      pagination: {
        page,
        limit,
        total: filteredSkills.length,
        totalPages: Math.ceil(filteredSkills.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { title, priority, description, slug, seo_title, seo_description, seo_keywords } = body;
    if (!title || !description || !slug) {
      return NextResponse.json(
        { error: 'Title, description, and slug are required' },
        { status: 400 }
      );
    }

    // Generate new ID
    const newId = Math.max(...mockSkills.map(s => s.id)) + 1;

    // Create new skill
    const newSkill = {
      id: newId,
      title,
      priority: priority || 1,
      description,
      slug,
      seo_title: seo_title || '',
      seo_description: seo_description || '',
      seo_keywords: seo_keywords || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock data
    mockSkills.push(newSkill);

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
