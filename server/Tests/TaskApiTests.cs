// Tests/Integration/TaskApiTests.cs
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using TaskManager.Models;
using Newtonsoft.Json;
using Xunit;

namespace TaskManager.Tests;

public class TaskApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly string defaultPath = "/api/v1";

    public TaskApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("http://localhost:5000") // <-- Include port!
        });
    }

    [Fact]
    public async Task GetAll_ShouldReturnSuccessAndCorrectContentType()
    {
        // Act
        var response = await _client.GetAsync($"{defaultPath}/tasks");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task GetAll_ShouldReturnTasksList()
    {
        // Act
        var response = await _client.GetAsync($"{defaultPath}/tasks");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        var tasks = JsonConvert.DeserializeObject<List<TaskItem>>(content);
        
        Assert.NotNull(tasks);
    }

    [Fact]
    public async Task CreateTask_WithValidData_ShouldReturnCreatedTask()
    {
        // Arrange
        var createTaskDto = new CreateTaskDto
        {
            Title = $"Test Task {Guid.NewGuid()}",
            Description = "Test Description",
            IsCompleted = false,
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        var json = JsonConvert.SerializeObject(createTaskDto);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"{defaultPath}/tasks", content);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdTask = JsonConvert.DeserializeObject<TaskItem>(responseContent);
        
        Assert.NotNull(createdTask);
        Assert.Equal(createTaskDto.Title, createdTask!.Title);
        Assert.Equal(createTaskDto.Description, createdTask.Description);
        Assert.Equal(createTaskDto.IsCompleted, createdTask.IsCompleted);
        Assert.NotEqual(Guid.Empty, createdTask.Id);
        Assert.True(Math.Abs((DateTime.UtcNow - createdTask.CreatedAt).TotalSeconds) <= 5);
    }

    [Fact]
    public async Task CreateTask_WithInvalidData_ShouldReturnBadRequest()
    {
        // Arrange - Task without required title
        var invalidTaskDto = new CreateTaskDto
        {
            Title = "", // Empty title should be invalid
            Description = "Description"
        };

        var json = JsonConvert.SerializeObject(invalidTaskDto);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"{defaultPath}/tasks", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetById_AfterCreating_ShouldReturnTask()
    {
        // Arrange - Create a task first
        var createTaskDto = new CreateTaskDto
        {
            Title = $"Get Test Task {Guid.NewGuid()}",
            Description = "Test Description for Get",
            IsCompleted = false,
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        var createJson = JsonConvert.SerializeObject(createTaskDto);
        var createContent = new StringContent(createJson, Encoding.UTF8, "application/json");
        
        var createResponse = await _client.PostAsync($"{defaultPath}/tasks", createContent);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        
        var createResponseContent = await createResponse.Content.ReadAsStringAsync();
        var createdTask = JsonConvert.DeserializeObject<TaskItem>(createResponseContent);

        // Act - Get the created task
        var response = await _client.GetAsync($"{defaultPath}/tasks/{createdTask!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        var retrievedTask = JsonConvert.DeserializeObject<TaskItem>(content);
        
        Assert.NotNull(retrievedTask);
        Assert.Equal(createdTask.Id, retrievedTask!.Id);
        Assert.Equal(createTaskDto.Title, retrievedTask.Title);
        Assert.Equal(createTaskDto.Description, retrievedTask.Description);
        Assert.Equal(createTaskDto.IsCompleted, retrievedTask.IsCompleted);
    }

    [Fact]
    public async Task GetById_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"{defaultPath}/tasks/{nonExistentId}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateTask_AfterCreating_ShouldUpdateTask()
    {
        // Arrange - Create a task first
        var createTaskDto = new CreateTaskDto
        {
            Title = $"Update Test Task {Guid.NewGuid()}",
            Description = "Original Description",
            IsCompleted = false
        };

        var createJson = JsonConvert.SerializeObject(createTaskDto);
        var createContent = new StringContent(createJson, Encoding.UTF8, "application/json");
        
        var createResponse = await _client.PostAsync($"{defaultPath}/tasks", createContent);
        var createResponseContent = await createResponse.Content.ReadAsStringAsync();
        var createdTask = JsonConvert.DeserializeObject<TaskItem>(createResponseContent);

        // Arrange - Update data
        var updateTaskDto = new UpdateTaskDto
        {
            Title = "Updated Title",
            Description = "Updated Description",
            IsCompleted = true,
            DueDate = DateTime.UtcNow.AddDays(2)
        };

        var updateJson = JsonConvert.SerializeObject(updateTaskDto);
        var updateContent = new StringContent(updateJson, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PutAsync($"{defaultPath}/tasks/{createdTask!.Id}", updateContent);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var updatedTask = JsonConvert.DeserializeObject<TaskItem>(responseContent);
        
        Assert.NotNull(updatedTask);
        Assert.Equal(createdTask.Id, updatedTask!.Id);
        Assert.Equal("Updated Title", updatedTask.Title);
        Assert.Equal("Updated Description", updatedTask.Description);
        Assert.True(updatedTask.IsCompleted);
    }

    [Fact]
    public async Task UpdateTask_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();
        var updateTaskDto = new UpdateTaskDto
        {
            Title = "Updated Title"
        };

        var json = JsonConvert.SerializeObject(updateTaskDto);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PutAsync($"{defaultPath}/tasks/{nonExistentId}", content);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteTask_AfterCreating_ShouldDeleteTask()
    {
        // Arrange - Create a task first
        var createTaskDto = new CreateTaskDto
        {
            Title = $"Delete Test Task {Guid.NewGuid()}",
            Description = "Task to be deleted"
        };

        var createJson = JsonConvert.SerializeObject(createTaskDto);
        var createContent = new StringContent(createJson, Encoding.UTF8, "application/json");
        
        var createResponse = await _client.PostAsync($"{defaultPath}/tasks", createContent);
        var createResponseContent = await createResponse.Content.ReadAsStringAsync();
        var createdTask = JsonConvert.DeserializeObject<TaskItem>(createResponseContent);

        // Act
        var response = await _client.DeleteAsync($"{defaultPath}/tasks/{createdTask!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        
        // Verify task is deleted by trying to get it
        var getResponse = await _client.GetAsync($"{defaultPath}/tasks/{createdTask.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteTask_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.DeleteAsync($"{defaultPath}/tasks/{nonExistentId}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}