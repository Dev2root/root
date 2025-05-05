// API URL - Change this to match your server
const API_URL = 'http://localhost:5000/api/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const tasksListEl = document.getElementById('tasks-list');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('edit-modal');
const closeBtn = document.querySelector('.close');
const editForm = document.getElementById('edit-form');
const editIdInput = document.getElementById('edit-id');
const editTitleInput = document.getElementById('edit-title');
const editDescriptionInput = document.getElementById('edit-description');
const editStatusInput = document.getElementById('edit-status');

// Current filter
let currentFilter = 'all';

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchTasks);
taskForm.addEventListener('submit', addTask);
editForm.addEventListener('submit', updateTask);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.status;
    fetchTasks();
  });
});

// Fetch tasks from API
async function fetchTasks() {
  try {
    tasksListEl.innerHTML = '<div class="loading">Loading tasks...</div>';
    
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    const tasks = await response.json();
    
    if (tasks.length === 0) {
      tasksListEl.innerHTML = '<p>No tasks found. Add a new task to get started!</p>';
      return;
    }
    
    let filteredTasks = tasks;
    if (currentFilter !== 'all') {
      filteredTasks = tasks.filter(task => task.status === currentFilter);
      
      if (filteredTasks.length === 0) {
        tasksListEl.innerHTML = `<p>No ${currentFilter} tasks found.</p>`;
        return;
      }
    }
    
    displayTasks(filteredTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    tasksListEl.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Display tasks in DOM
function displayTasks(tasks) {
  tasksListEl.innerHTML = '';
  
  tasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task-item');
    taskEl.dataset.id = task._id;
    
    const statusClass = `status-${task.status}`;
    const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    taskEl.innerHTML = `
      <div class="task-content">
        <span class="task-status ${statusClass}">${formatStatus(task.status)}</span>
        <h3>${task.title}</h3>
        <p class="task-description">${task.description || 'No description'}</p>
        <small>Created: ${formattedDate}</small>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-id="${task._id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${task._id}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    
    // Add event listeners to the buttons
    const editBtn = taskEl.querySelector('.edit-btn');
    const deleteBtn = taskEl.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => openEditModal(task));
    deleteBtn.addEventListener('click', () => deleteTask(task._id));
    
    tasksListEl.appendChild(taskEl);
  });
}

// Format status string
function formatStatus(status) {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Add new task
async function addTask(e) {
  e.preventDefault();
  
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = statusInput.value;
  
  if (!title) return;
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, status })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add task');
    }
    
    // Reset form
    taskForm.reset();
    
    // Fetch updated tasks
    fetchTasks();
    
    // Show success feedback
    showFeedback('Task added successfully!', 'success');
  } catch (error) {
    console.error('Error adding task:', error);
    showFeedback(`Error: ${error.message}`, 'error');
  }
}

// Open edit modal
function openEditModal(task) {
  editIdInput.value = task._id;
  editTitleInput.value = task.title;
  editDescriptionInput.value = task.description || '';
  editStatusInput.value = task.status;
  
  modal.style.display = 'block';
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
}

// Update task
async function updateTask(e) {
  e.preventDefault();
  
  const id = editIdInput.value;
  const title = editTitleInput.value.trim();
  const description = editDescriptionInput.value.trim();
  const status = editStatusInput.value;
  
  if (!title) return;
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, status })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    // Close modal
    closeModal();
    
    // Fetch updated tasks
    fetchTasks();
    
    // Show success feedback
    showFeedback('Task updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating task:', error);
    showFeedback(`Error: ${error.message}`, 'error');
  }
}

// Delete task
async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    
    // Fetch updated tasks
    fetchTasks();
    
    // Show success feedback
    showFeedback('Task deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting task:', error);
    showFeedback(`Error: ${error.message}`, 'error');
  }
}

// Show feedback message
function showFeedback(message, type = 'success') {
  // Create feedback element
  const feedbackEl = document.createElement('div');
  feedbackEl.className = `feedback ${type}`;
  feedbackEl.textContent = message;
  
  // Add to DOM
  document.body.appendChild(feedbackEl);
  
  // Style
  Object.assign(feedbackEl.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c',
    color: '#fff',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });
  
  // Animate in
  setTimeout(() => {
    feedbackEl.style.opacity = '1';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    feedbackEl.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(feedbackEl);
    }, 300);
  }, 3000);
}