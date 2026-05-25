import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

export default function TodosPage() {
  const [todos, setTodos] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const supabase = createClient();

  const fetchTodos = async () => {
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(todos);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('todos')
        .insert([{ name: newTodo.trim(), completed: false }]);

      if (error) throw error;

      setNewTodo('');
      toast.success('Todo added!');
      fetchTodos();
    } catch (error: any) {
      toast.error('Failed to add todo');
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;
      fetchTodos();
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Todo deleted');
      fetchTodos();
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto border-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Company Intelligence Todos
          </CardTitle>
          <p className="text-xs text-muted-foreground">Track remaining company research and data scaling tasks.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task (e.g. Verify Apple financials...)"
              className="bg-background border-border"
              disabled={isAdding}
            />
            <Button type="submit" disabled={isAdding || !newTodo.trim()} className="shrink-0">
              {isAdding ? '...' : <Plus className="w-4 h-4" />}
            </Button>
          </form>

          {/* Todo List */}
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ul className="space-y-3">
              {todos?.map((todo) => (
                <li 
                  key={todo.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id, todo.completed)}>
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className={todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                      {todo.name}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
              {todos?.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground text-sm italic">No active todos. Great job!</p>
                </div>
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
