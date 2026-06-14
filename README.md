# Daily Tasks Website

This project is a simple web application that allows users to create and manage a daily task list. Users can add tasks, mark them as completed, and organize them into different folders.

## Features

- Create, edit, and delete tasks
- Mark tasks as completed with a tick mark
- Organize tasks into different folders
- Responsive design for various screen sizes

## Project Structure

```
daily-tasks-website
├── src
│   ├── index.html          # Main HTML file
│   ├── styles              # Contains CSS files
│   │   ├── main.css        # Main styles
│   │   └── components.css   # Component-specific styles
│   ├── scripts             # Contains JavaScript files
│   │   ├── app.js          # Main application logic
│   │   ├── storage.js      # Task storage management
│   │   └── ui.js           # User interface management
│   ├── components          # HTML components
│   │   ├── task-item.html  # Task item structure
│   │   ├── task-editor.html # Task editor structure
│   │   └── folder-corner.html # Folder management interface
│   └── data               # Sample data
│       └── tasks.sample.json # Sample tasks in JSON format
├── package.json            # NPM configuration
├── .gitignore              # Files to ignore in version control
└── README.md               # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd daily-tasks-website
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Open `src/index.html` in your web browser.
2. Use the task editor to add new tasks.
3. Organize tasks into folders using the folder management interface.
4. Mark tasks as completed by clicking the tick mark.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.