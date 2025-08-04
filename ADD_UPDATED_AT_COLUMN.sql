-- Add updatedAt column to Tickets table
-- This column will track when the ticket was last updated

-- Add the updatedAt column
ALTER TABLE Tickets 
ADD updatedAt DATETIME DEFAULT GETDATE();

-- Update existing records to set updatedAt = createdAt initially
UPDATE Tickets 
SET updatedAt = createdAt 
WHERE updatedAt IS NULL;

-- Make updatedAt NOT NULL after setting initial values
ALTER TABLE Tickets 
ALTER COLUMN updatedAt DATETIME NOT NULL;

-- Add a default constraint to automatically set updatedAt to current timestamp
ALTER TABLE Tickets 
ADD CONSTRAINT DF_Tickets_updatedAt DEFAULT GETDATE() FOR updatedAt;

-- Optional: Add an index on updatedAt for better performance
CREATE INDEX IX_Tickets_updatedAt ON Tickets(updatedAt);

PRINT '✅ updatedAt column added successfully to Tickets table';
PRINT '📝 All existing tickets have been updated with updatedAt = createdAt';
PRINT '🔄 New tickets will automatically get current timestamp in updatedAt'; 