<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Universal Controller - Home Assistant Custom Integration

This is a Home Assistant custom integration project that provides a universal control component with three configurable input areas:

1. **TypeScript/JavaScript Code** - Runs periodically with full access to Home Assistant devices and entities
2. **HTML Template** - For visual card representation  
3. **CSS Styling** - For card presentation styling

## Project Structure

- `custom_components/universal_controller/` - Python-based Home Assistant integration
- `www/universal-controller/` - TypeScript-based frontend card component

## Development Guidelines

### Home Assistant Integration (Python)
- Follow Home Assistant integration patterns and conventions
- Use proper async/await patterns
- Implement config flows for user setup
- Use coordinators for data updates
- Handle errors gracefully with logging

### Frontend Card (TypeScript)
- Built with Lit Web Components
- Follows Home Assistant card conventions  
- Uses Shadow DOM for style encapsulation
- Implements proper TypeScript types
- Supports Home Assistant theming

### Code Execution Security
- User-provided TypeScript/JavaScript code should be executed safely
- Provide access to Home Assistant API through controlled context
- Implement proper error handling and logging
- Consider using sandboxed execution environments

### UI/UX Design
- Follow Home Assistant Material Design principles
- Support both light and dark themes
- Provide clear visual feedback for code execution
- Use intuitive tab navigation between code/HTML/CSS editors
- Display execution results and errors clearly

## Key Features to Implement

1. **Live Code Editor** with syntax highlighting
2. **Template Engine** for HTML rendering with data binding
3. **CSS Hot-reloading** for live styling updates
4. **Periodic Execution** of user code with configurable intervals
5. **Entity State Management** with proper Home Assistant integration
6. **Error Handling** with detailed feedback to users
7. **Configuration Persistence** in Home Assistant

When working on this project:
- Prioritize security when executing user code
- Ensure compatibility with Home Assistant Core
- Test with both YAML and UI configuration methods
- Document API endpoints and service calls
- Provide comprehensive examples for common use cases
