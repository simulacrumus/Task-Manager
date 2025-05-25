using TaskManager.Models;

namespace TaskManager.Repositories;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllAsync(string? query, bool? completed);
    Task<TaskItem?> GetByIdAsync(Guid id);
    Task AddAsync(TaskItem task);
    Task UpdateAsync(TaskItem task);
    Task DeleteAsync(TaskItem task);
    Task SaveChangesAsync();
}