# Changelog

## [1.4.2] - 2025-07-29

### Bug Fixes
- Service configuration improvements and stability enhancements

## [1.4.0] - 2025-07-29

### Major Architecture Change: Service-Centric Design
- **Service Entities as Tickers**: Universal Controller now uses service instances as background tickers
- **Independent Background Execution**: Code executes regardless of UI rendering state
- **Service-Based Configuration**: Configuration stored with service entities, not cards
- **Persistent Background Tasks**: Tickers run continuously in the background

### New Ticker Services
- `create_ticker`: Create a new background ticker instance
- `update_ticker`: Update existing ticker configuration
- `delete_ticker`: Remove a ticker instance
- `get_ticker`: Retrieve ticker configuration and status
- `list_tickers`: Get all ticker configurations
- `execute_ticker`: Manually execute a ticker's code

### Enhanced Architecture
- **Ticker Manager**: Centralized management of all ticker instances
- **Persistent Storage**: Ticker configurations persist across Home Assistant restarts
- **Real-time Execution**: Immediate code execution on ticker creation/updates
- **Event System**: Comprehensive events for ticker execution and status changes

### Card Integration
- Cards now connect to ticker services via `ticker_id`
- UI becomes a display layer for service-based data
- Configuration editor supports ticker selection and creation

### Legacy Support
- Maintained backward compatibility with existing card-based configurations
- Legacy services marked as deprecated but still functional

## [1.3.7] - 2025-07-29

### Added
- Configurable card width (1/4, 1/2, 3/4, full width)
- Configurable card height (1-10 grid rows)
- Configurable update interval through UI
- Card configuration editor for easy setup
- Dynamic CSS styling based on card width configuration

### Fixed
- Configuration loading timing issues that caused defaults to override saved settings
- Card sizing now properly integrates with Home Assistant grid layout
- Improved configuration persistence reliability

### Enhanced
- Better user experience with immediate configuration application
- Added comprehensive card configuration options
- Improved frontend registration stability

## [1.0.0] - 2025-07-28

### Added
- Initial release of Universal Controller
- TypeScript/JavaScript code execution with full Home Assistant API access
- HTML template system for custom card layouts
- CSS styling system for visual customization
- Tab-based interface (Preview, TypeScript, HTML, CSS)
- Live code editor with syntax highlighting
- Periodic code execution with configurable intervals
- Error handling and execution feedback
- Home Assistant integration with config flow
- Service calls for code execution and template updates
- Persistent configuration storage
- Dark/Light theme support
- Material Design following Home Assistant guidelines

### Features
- **Live Code Execution**: Run TypeScript/JavaScript periodically
- **Full HA Access**: Complete access to `hass.states`, `hass.services`, etc.
- **Visual Designer**: Edit HTML and CSS directly in the interface
- **Tab Interface**: Switch between Preview, Code, HTML, and CSS
- **Live Preview**: Instant preview of changes
- **Error Handling**: Detailed execution error feedback
- **Persistence**: Configuration saved in Home Assistant

### Use Cases
- Climate control automation
- Light automation based on sensors
- Energy management
- Custom dashboards
- Advanced automation logic
- Real-time data visualization
