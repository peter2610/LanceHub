"use client"

// Table utility classes for column distribution
export const tableColumnClasses = {
  // Equal distribution
  equal: "w-1/6", // For 6 columns
  
  // Specific column widths
  id: "w-16",      // Small ID column
  client: "w-1/4", // Client name
  title: "w-1/3",  // Title (longer text)
  status: "w-24",  // Status badge
  writer: "w-1/4", // Writer name
  amount: "w-24",  // Amount
  actions: "w-16", // Actions column
  
  // Responsive column widths
  "responsive-id": "w-16 sm:w-20",
  "responsive-client": "w-1/4 sm:w-1/5",
  "responsive-title": "w-1/3 sm:w-2/5",
  "responsive-status": "w-20 sm:w-24",
  "responsive-writer": "w-1/4 sm:w-1/5",
  "responsive-amount": "w-20 sm:w-24",
  "responsive-actions": "w-16 sm:w-20",
}

// Helper function to apply column classes
export function getTableColumnClass(columnType) {
  return tableColumnClasses[columnType] || "w-auto"
}

// Common table layout presets
export const tableLayouts = {
  // Standard 6-column layout
  standard: [
    "w-16",      // ID
    "w-1/4",     // Client
    "w-1/3",     // Title
    "w-24",      // Status
    "w-1/4",     // Writer
    "w-24"       // Amount
  ],
  
  // Compact layout
  compact: [
    "w-12",      // ID
    "w-1/5",     // Client
    "w-2/5",     // Title
    "w-20",      // Status
    "w-1/5",     // Writer
    "w-20"       // Amount
  ],
  
  // Spacious layout
  spacious: [
    "w-20",      // ID
    "w-1/3",     // Client
    "w-2/5",     // Title
    "w-32",      // Status
    "w-1/3",     // Writer
    "w-32"       // Amount
  ]
}
