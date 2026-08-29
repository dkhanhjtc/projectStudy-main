import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Users, BookOpen, Trash2, ShieldAlert, Edit, CheckCircle } from 'lucide-react';
import { mockLessons } from '../lib/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function AdminDashboardPage() {
  const [users, setUsers] = useState(mockLessons.users);
  
  // Aggregate all lessons for simple admin view
  const allLessons = [
    ...mockLessons.vocabulary.map(l => ({ ...l, category: 'Vocabulary' })),
    ...mockLessons.grammar.map(l => ({ ...l, category: 'Grammar' })),
    ...mockLessons.reading.map(l => ({ ...l, category: 'Reading' })),
    ...mockLessons.listening.map(l => ({ ...l, category: 'Listening' }))
  ];
  
  const [lessons, setLessons] = useState(allLessons);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'content'

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleGrantAdmin = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: 'admin' } : u));
  };

  const handleDeleteLesson = (id) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold flex items-center gap-3">
            <ShieldAlert className="text-destructive" size={32} />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Manage users, roles, and learning content.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-border mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 font-bold text-lg px-2 transition-colors ${
            activeTab === 'users' ? 'text-foreground border-b-4 border-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={20} /> User Management
          </div>
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-2 font-bold text-lg px-2 transition-colors ${
            activeTab === 'content' ? 'text-foreground border-b-4 border-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={20} /> Content Management
          </div>
        </button>
      </div>

      {activeTab === 'users' && (
        <motion.div variants={itemVariants} className="space-y-4">
          <Card className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted border-b-2 border-border text-muted-foreground text-sm uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-border font-semibold">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">{user.name}</td>
                      <td className="p-4 text-muted-foreground">{user.email}</td>
                      <td className="p-4">
                        <Badge color={user.role === 'admin' ? 'destructive' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {user.role !== 'admin' && (
                          <Button variant="outline" size="sm" onClick={() => handleGrantAdmin(user.id)}>
                            Make Admin
                          </Button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'content' && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button variant="primary" icon={CheckCircle}>Add New Lesson</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="!p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <Badge color="accent">{lesson.category}</Badge>
                  <div className="flex gap-2 text-muted-foreground">
                    <button className="hover:text-foreground transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteLesson(lesson.id)} className="hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{lesson.title}</h3>
                {lesson.type && <p className="text-sm text-muted-foreground font-semibold uppercase">Type: {lesson.type}</p>}
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
