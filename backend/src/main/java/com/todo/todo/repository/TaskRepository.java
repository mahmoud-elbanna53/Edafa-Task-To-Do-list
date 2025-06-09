package com.todo.todo.repository;

import com.todo.todo.model.Task;
import com.todo.todo.model.TaskStatus;
import com.todo.todo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserAndStatus(User user, TaskStatus status);
} 