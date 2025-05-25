using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Models;
using TaskManager.Services;

namespace TaskManagerApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly ILogger<TasksController> _logger;

    public TasksController(ITaskService taskService, ILogger<TasksController> logger)
    {
        _taskService = taskService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetTasks(
        [FromQuery] string? query = null,
        [FromQuery] bool? completed = null)
    {
        try
        {
            var tasks = await _taskService.GetAllAsync(query, completed);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetTasks endpoint with parameters - Query: {Query}, IsCompleted: {IsCompletedOnly}", 
                query, completed);
            return StatusCode(500, "An error occurred while retrieving tasks");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(Guid id)
    {
        try
        {
            var task = await _taskService.GetByIdAsync(id);

            if (task == null)
            {
                return NotFound($"Task with ID {id} not found");
            }

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving task with ID {TaskId}", id);
            return StatusCode(500, "An error occurred while retrieving the task");
        }
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask([FromBody] CreateTaskDto taskDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdTask = await _taskService.AddAsync(taskDto);

            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return StatusCode(500, "An error occurred while creating the task");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(Guid id, [FromBody] UpdateTaskDto taskDto)
    {
        try
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTask = await _taskService.GetByIdAsync(id);
            if (existingTask == null)
            {
                return NotFound($"Task with ID {id} not found");
            }

            var updatedTask = await _taskService.UpdateAsync(id, taskDto);

            return Ok(updatedTask);
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict("Task was modified by another user. Please refresh and try again.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task with ID {TaskId}", id);
            return StatusCode(500, "An error occurred while updating the task");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(Guid id)
    {
        try
        {
            var hasDeleted = await _taskService.DeleteAsync(id);
            return hasDeleted ? NoContent() : NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task with ID {TaskId}", id);
            return StatusCode(500, "An error occurred while deleting the task");
        }
    }
}