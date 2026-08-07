# Visual Workflow Builder Architecture & UI Specification

## Canvas Capabilities

- **Interactive Drag & Drop**: Add nodes onto the infinite grid canvas.
- **Port-to-Port Edge Connections**: Output ports connect to input ports with directional arrows and SVG Bezier curves.
- **Node Selection & Inspector**: Right-hand drawer for editing label, nodeType, payload JSON, and environment variables.
- **Undo / Redo System**: Timeline-backed state history managed inside `useWorkflowStore`.
- **Zoom & Pan Controls**: Multi-scale zoom (40% to 200%) and drag-pan grid alignment.
