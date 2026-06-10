import { supabase } from '../config/supabase.js';

// GET /tasks
export const getTasks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /tasks
export const createTask = async (req, res) => {
  try {
    const { task, category, priority, status, date, descripcion } = req.body;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ task, category, priority, status, date, descripcion }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, category, priority, status, date, descripcion } = req.body;

    const { data, error } = await supabase
      .from('tasks')
      .update({ task, category, priority, status, date, descripcion })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

