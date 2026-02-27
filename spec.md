# Specification

## Summary
**Goal:** Add camera functionality to capture animal photos and display them throughout the detection workflow.

**Planned changes:**
- Add camera capture button to the symptom detection form
- Implement device camera access using MediaDevices API
- Store captured photos as base64 in localStorage alongside detection records
- Display photo thumbnails in detection history
- Show full-size photos on the results page
- Handle camera permissions with user feedback for denied/unavailable scenarios

**User-visible outcome:** Users can take photos of their animals directly from the app, which are saved with detection records and displayed in history and results.
