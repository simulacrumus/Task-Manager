using Moq;
using TaskManager.Models;
using TaskManager.Repositories;
using TaskManager.Services;
using Xunit;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _mockRepo;
    private readonly TaskService _service;

    public TaskServiceTests()
    {
        _mockRepo = new Mock<ITaskRepository>();
        _service = new TaskService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllTasks()
    {
        // Arrange
        var tasks = new List<TaskItem>
        {
            new TaskItem { Id = Guid.NewGuid(), Title = "Task 1", Description = "Description 1", IsCompleted = false },
            new TaskItem { Id = Guid.NewGuid(), Title = "Task 2", Description = "Description 2", IsCompleted = true }
        };
        _mockRepo.Setup(repo => repo.GetAllAsync(null, null))
            .ReturnsAsync(tasks);

        // Act
        var result = await _service.GetAllAsync(null, null);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal(tasks[0].Title, result[0].Title);
        Assert.Equal(tasks[1].Title, result[1].Title);
    }

    [Fact]
    public async Task GetByIdAsync_WhenTaskExists_ShouldReturnTask()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var task = new TaskItem { Id = taskId, Title = "Test Task", Description = "Test Description", IsCompleted = false };
        _mockRepo.Setup(repo => repo.GetByIdAsync(taskId))
            .ReturnsAsync(task);

        // Act
        var result = await _service.GetByIdAsync(taskId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(task.Title, result.Title);
        Assert.Equal(task.Description, result.Description);
    }

    [Fact]
    public async Task GetByIdAsync_WhenTaskDoesNotExist_ShouldReturnNull()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        _mockRepo.Setup(repo => repo.GetByIdAsync(taskId))
            .ReturnsAsync((TaskItem?)null);

        // Act
        var result = await _service.GetByIdAsync(taskId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_ShouldCreateAndReturnNewTask()
    {
        // Arrange
        var createDto = new CreateTaskDto
        {
            Title = "New Task",
            Description = "New Description",
            IsCompleted = false,
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        _mockRepo.Setup(repo => repo.AddAsync(It.IsAny<TaskItem>()))
            .Returns(Task.CompletedTask);
        _mockRepo.Setup(repo => repo.SaveChangesAsync())
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.AddAsync(createDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(createDto.Title, result.Title);
        Assert.Equal(createDto.Description, result.Description);
        Assert.Equal(createDto.IsCompleted, result.IsCompleted);
        Assert.Equal(createDto.DueDate, result.DueDate);
        _mockRepo.Verify(repo => repo.AddAsync(It.IsAny<TaskItem>()), Times.Once);
        _mockRepo.Verify(repo => repo.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WhenTaskExists_ShouldUpdateAndReturnTask()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var existingTask = new TaskItem 
        { 
            Id = taskId, 
            Title = "Original Title", 
            Description = "Original Description", 
            IsCompleted = false 
        };
        var updateDto = new UpdateTaskDto
        {
            Title = "Updated Title",
            Description = "Updated Description",
            IsCompleted = true
        };

        _mockRepo.Setup(repo => repo.GetByIdAsync(taskId))
            .ReturnsAsync(existingTask);
        _mockRepo.Setup(repo => repo.SaveChangesAsync())
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.UpdateAsync(taskId, updateDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(updateDto.Title, result.Title);
        Assert.Equal(updateDto.Description, result.Description);
        Assert.Equal(updateDto.IsCompleted, result.IsCompleted);
        _mockRepo.Verify(repo => repo.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WhenTaskExists_ShouldDeleteTask()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var task = new TaskItem { Id = taskId, Title = "Test Task" };
        
        _mockRepo.Setup(repo => repo.GetByIdAsync(taskId))
            .ReturnsAsync(task);
        _mockRepo.Setup(repo => repo.DeleteAsync(task))
            .Returns(Task.CompletedTask);
        _mockRepo.Setup(repo => repo.SaveChangesAsync())
            .Returns(Task.CompletedTask);

        // Act
        await _service.DeleteAsync(taskId);

        // Assert
        _mockRepo.Verify(repo => repo.DeleteAsync(task), Times.Once);
        _mockRepo.Verify(repo => repo.SaveChangesAsync(), Times.Once);
    }
}

