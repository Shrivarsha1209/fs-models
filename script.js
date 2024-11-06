// script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
  
    // Fetch and display all tasks on load
    fetchTasks();
  
    // Event listener for adding a new task
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('taskTitle').value;
      const description = document.getElementById('taskDescription').value;
  
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        if (response.ok) {
          fetchTasks(); // Refresh the task list
          taskForm.reset();
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    });
  
    // Function to fetch and display tasks
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        taskList.innerHTML = ''; // Clear the current list
  
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${task.title} - ${task.completed ? 'Completed' : 'Pending'}</span>
            <button onclick="markTaskCompleted('${task._id}')">Mark as Completed</button>
            <button onclick="deleteTask('${task._id}')">Delete</button>
          `;
          taskList.appendChild(li);
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  
    // Mark a task as completed
    window.markTaskCompleted = async (taskId) => {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        });
        fetchTasks(); // Refresh the task list
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };
  
    // Delete a task
    window.deleteTask = async (taskId) => {
      try {
        await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        fetchTasks(); // Refresh the task list
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };
  });
  