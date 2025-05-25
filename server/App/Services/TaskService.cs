using TaskManager.Models;
using TaskManager.Repositories;

namespace TaskManager.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repo;

    public TaskService(ITaskRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<TaskDto>> GetAllAsync(string? query, bool? completed)
    {
        var tasks = await _repo.GetAllAsync(query, completed);
        return tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            IsCompleted = t.IsCompleted,
            DueDate = t.DueDate
        }).ToList();
    }

    public async Task<TaskDto?> GetByIdAsync(Guid id)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null) return null;
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            DueDate = task.DueDate
        };
    }

    public async Task<TaskDto> AddAsync(CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description ?? string.Empty,
            IsCompleted = dto.IsCompleted,
            DueDate = dto.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(task);
        await _repo.SaveChangesAsync();
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            DueDate = task.DueDate
        };
    }

    public async Task<TaskDto> UpdateAsync(Guid id, UpdateTaskDto dto)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task is null) throw new KeyNotFoundException($"Task with ID {id} not found");

        task.Title = dto.Title ?? task.Title;
        task.Description = dto.Description ?? task.Description;
        task.IsCompleted = dto.IsCompleted ?? task.IsCompleted;
        task.DueDate = dto.DueDate ?? task.DueDate;

        await _repo.UpdateAsync(task);
        await _repo.SaveChangesAsync();
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            DueDate = task.DueDate
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task is null) return false;

        await _repo.DeleteAsync(task);
        await _repo.SaveChangesAsync();
        return true;
    }
}