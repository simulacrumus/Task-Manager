using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _db;

    public TaskRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TaskItem>> GetAllAsync(string? query, bool? completed)
    {
        var tasks = _db.Tasks.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            query = query.ToLower();
            tasks = tasks.Where(t =>
                t.Title.ToLower().Contains(query) ||
                t.Description.ToLower().Contains(query));
        }

        if (completed.HasValue)
        {
            tasks = tasks.Where(t => t.IsCompleted == completed);
        }

        return await tasks.OrderBy(t => t.DueDate).ToListAsync();
    }

    public async Task<TaskItem?> GetByIdAsync(Guid id) =>
        await _db.Tasks.FindAsync(id);

    public async Task AddAsync(TaskItem task) =>
        await _db.Tasks.AddAsync(task);

    public Task UpdateAsync(TaskItem task)
    {
        _db.Tasks.Update(task);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(TaskItem task)
    {
        _db.Tasks.Remove(task);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await _db.SaveChangesAsync();
}