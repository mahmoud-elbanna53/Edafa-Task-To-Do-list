package com.todo.todo.controller;

import com.todo.todo.dto.TaskDto;
import com.todo.todo.model.Task;
import com.todo.todo.model.TaskStatus;
import com.todo.todo.model.User;
import com.todo.todo.repository.TaskRepository;
import com.todo.todo.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        User user = getCurrentUser();
        List<Task> tasks = taskRepository.findByUser(user);
        List<TaskDto> taskDtos = tasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id) {
        User user = getCurrentUser();
        return taskRepository.findById(id)
                .filter(task -> task.getUser().equals(user))
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskDto taskDto) {
        User user = getCurrentUser();
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());
        task.setStatus(taskDto.getStatus());
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(convertToDto(savedTask));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @Valid @RequestBody TaskDto taskDto) {
        User user = getCurrentUser();
        return taskRepository.findById(id)
                .filter(task -> task.getUser().equals(user))
                .map(task -> {
                    task.setTitle(taskDto.getTitle());
                    task.setDescription(taskDto.getDescription());
                    task.setDueDate(taskDto.getDueDate());
                    task.setStatus(taskDto.getStatus());
                    return taskRepository.save(task);
                })
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        User user = getCurrentUser();
        return taskRepository.findById(id)
                .filter(task -> task.getUser().equals(user))
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TaskDto convertToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setStatus(task.getStatus());
        return dto;
    }
} 