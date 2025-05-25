using TaskManager.Models;

namespace TaskManager.Services;

public interface ITaskService
{
    Task<List<TaskDto>> GetAllAsync(string? query, bool? completed);
    Task<TaskDto?> GetByIdAsync(Guid id);
    Task<TaskDto> AddAsync(CreateTaskDto dto);
    Task<TaskDto> UpdateAsync(Guid id, UpdateTaskDto dto);
    Task<bool> DeleteAsync(Guid id);
}