// Task Manager Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const tasksContainer = document.getElementById('tasks-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Current filter state
    let currentFilter = 'all';
    
    // Initialize the app
    init();
    
    // Initialize the application
    function init() {
        loadTasks();
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Form submission
        taskForm.addEventListener('submit', handleAddTask);
        
        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => handleFilterChange(button));
        });
    }
    
    // Handle adding a new task
    function handleAddTask(e) {
        e.preventDefault();
        
        const title = taskTitleInput.value.trim();
        const desc = taskDescInput.value.trim();
        
        if (title) {
            const newTask = {
                id: Date.now(),
                title,
                desc,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            addTaskToDOM(newTask);
            saveTask(newTask);
            
            // Reset form
            taskForm.reset();
            taskTitleInput.focus();
        }
    }
    
    // Add task to the DOM
    function addTaskToDOM(task) {
        const taskElement = document.createElement('li');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;
        
        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                ${task.desc ? `<p class="task-desc">${task.desc}</p>` : ''}
            </div>
            <div class="task-actions">
                <button class="complete-btn" title="${task.completed ? 'Mark as active' : 'Mark as complete'}">
                    <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                </button>
                <button class="delete-btn" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners to the new buttons
        const completeBtn = taskElement.querySelector('.complete-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');
        
        completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        tasksContainer.appendChild(taskElement);
    }
    
    // Toggle task completion status
    function toggleTaskCompletion(taskId) {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks(tasks);
            loadTasks();
        }
    }
    
    // Delete a task
    function deleteTask(taskId) {
        const tasks = getTasks().filter(task => task.id !== taskId);
        saveTasks(tasks);
        loadTasks();
    }
    
    // Handle filter change
    function handleFilterChange(button) {
        currentFilter = button.dataset.filter;
        
        // Update active state of buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        loadTasks();
    }
    
    // Load tasks based on current filter
    function loadTasks() {
        const tasks = getTasks();
        tasksContainer.innerHTML = '';
        
        let filteredTasks = tasks;
        
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = '<p class="no-tasks">No tasks found.</p>';
        } else {
            filteredTasks.forEach(task => addTaskToDOM(task));
        }
    }
    
    // Get tasks from local storage
    function getTasks() {
        const tasksJSON = localStorage.getItem('tasks');
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }
    
    // Save a single task
    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
    }
    
    // Save all tasks to local storage
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});