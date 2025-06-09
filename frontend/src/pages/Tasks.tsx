import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/api';
import type { Task } from '../types';
import { TaskStatus } from '../types';

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [open, setOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
    const { logout } = useAuth();

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getAllTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    const handleOpen = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setTitle(task.title);
            setDescription(task.description);
            setDueDate(task.dueDate.split('T')[0]);
            setStatus(task.status);
        } else {
            setEditingTask(null);
            setTitle('');
            setDescription('');
            setDueDate('');
            setStatus(TaskStatus.PENDING);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingTask(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.id, {
                    title,
                    description,
                    dueDate: new Date(dueDate).toISOString(),
                    status,
                });
            } else {
                await taskService.createTask({
                    title,
                    description,
                    dueDate: new Date(dueDate).toISOString(),
                    status,
                });
            }
            handleClose();
            loadTasks();
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await taskService.deleteTask(id);
            loadTasks();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    return (
        <Container>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Tasks
                    </Typography>
                    <Box>
                        <Button variant="contained" onClick={() => handleOpen()} sx={{ mr: 2 }}>
                            Add Task
                        </Button>
                        <Button variant="outlined" onClick={logout}>
                            Logout
                        </Button>
                    </Box>
                </Box>
                <List>
                    {tasks.map((task) => (
                        <ListItem key={task.id} divider>
                            <ListItemText
                                primary={task.title}
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                            {task.description}
                                        </Typography>
                                        <br />
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                        <br />
                                        Status: {task.status}
                                    </>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleOpen(task)} sx={{ mr: 1 }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Due Date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        >
                            <MenuItem value={TaskStatus.PENDING}>Pending</MenuItem>
                            <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingTask ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Tasks; 