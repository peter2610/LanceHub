// Shared assignments data for both admin and writer dashboards
export const initialAssignments = [
  {
    id: 'LH-2025-001',
    clientId: '1',
    clientName: 'John Doe',
    title: 'Research Paper on Machine Learning',
    description: '10-page research paper on ML applications in healthcare',
    status: 'PENDING',
    amount: 150,
    deadline: '2025-02-01',
    submittedAt: '2025-01-27',
    assignedWriter: null,
    writerName: null
  },
  {
    id: 'LH-2025-002',
    clientId: '2',
    clientName: 'Jane Smith',
    title: 'Business Plan for Startup',
    description: 'Comprehensive business plan for tech startup including financial projections',
    status: 'ASSIGNED',
    amount: 200,
    deadline: '2025-02-15',
    submittedAt: '2025-01-25',
    assignedWriter: '1',
    writerName: 'Alice Johnson'
  },
  {
    id: 'LH-2025-003',
    clientId: '3',
    clientName: 'Bob Johnson',
    title: 'Marketing Strategy Analysis',
    description: 'In-depth analysis of current marketing strategies and recommendations',
    status: 'IN_PROGRESS',
    amount: 150,
    deadline: '2025-02-10',
    submittedAt: '2025-01-24',
    assignedWriter: '2',
    writerName: 'Bob Smith'
  },
  {
    id: 'LH-2025-004',
    clientId: '4',
    clientName: 'Alice Brown',
    title: 'Technical Documentation',
    description: 'User manual and API documentation for software product',
    status: 'COMPLETED',
    amount: 180,
    deadline: '2025-02-05',
    submittedAt: '2025-01-20',
    assignedWriter: '3',
    writerName: 'Carol Davis'
  },
  {
    id: 'LH-2025-005',
    clientId: '5',
    clientName: 'Charlie Wilson',
    title: 'Content Writing for Blog',
    description: '5 blog posts on digital marketing trends',
    status: 'PENDING',
    amount: 100,
    deadline: '2025-02-03',
    submittedAt: '2025-01-26',
    assignedWriter: null,
    writerName: null
  },
  {
    id: 'LH-2025-006',
    clientId: '6',
    clientName: 'Diana Prince',
    title: 'Legal Contract Review',
    description: 'Review and edit legal contracts and agreements',
    status: 'ASSIGNED',
    amount: 300,
    deadline: '2025-02-08',
    submittedAt: '2025-01-22',
    assignedWriter: '4',
    writerName: 'Mike Chen'
  },
  {
    id: 'LH-2025-007',
    clientId: '7',
    clientName: 'Edward Norton',
    title: 'Technical Documentation',
    description: 'API documentation and user manuals',
    status: 'COMPLETED',
    amount: 160,
    deadline: '2025-01-28',
    submittedAt: '2025-01-21',
    assignedWriter: '5',
    writerName: 'Sarah Wilson',
    paid: true,
    paidAt: '2025-01-22'
  },
  {
    id: 'LH-2025-008',
    clientId: '8',
    clientName: 'Fiona Green',
    title: 'Social Media Strategy',
    description: 'Comprehensive social media marketing strategy',
    status: 'PENDING',
    amount: 120,
    deadline: '2025-02-12',
    submittedAt: '2025-01-23',
    assignedWriter: null,
    writerName: null
  }
];

export const mockWriters = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', rating: 4.8, activeAssignments: 2 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', rating: 4.6, activeAssignments: 1 },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', rating: 4.9, activeAssignments: 3 },
  { id: '4', name: 'Mike Chen', email: 'mike@example.com', rating: 4.7, activeAssignments: 1 },
  { id: '5', name: 'Sarah Wilson', email: 'sarah@example.com', rating: 4.5, activeAssignments: 2 }
];

export const pendingWriters = [
  { id: '6', name: 'Tom Brown', email: 'tom@example.com', rating: 4.2 },
  { id: '7', name: 'Lisa Anderson', email: 'lisa@example.com', rating: 4.4 }
];
