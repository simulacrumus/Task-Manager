using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models;

public class TaskDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime DueDate { get; set; }
}

public class CreateTaskDto
{
    [Required(ErrorMessage = "Title is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 20 characters")]
    public string Title { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot exceed 50 characters")]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; } = false;

    [DataType(DataType.DateTime)]
    public DateTime DueDate { get; set; }


}

public class UpdateTaskDto
{
    [Required(ErrorMessage = "Title is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 100 characters")]
    public string? Title { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    public bool? IsCompleted { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime? DueDate { get; set; }
}