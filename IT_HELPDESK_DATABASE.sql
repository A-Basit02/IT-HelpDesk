/*
  IT Help Desk — SQL Server database creation
  Run this in SSMS or sqlcmd against a SQL Server instance.

  Connection (from server/.env):
    DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

  Change the database name below if your DB_NAME is different.
*/

USE master;
GO

IF DB_ID(N'ITHelpDesk') IS NULL
BEGIN
  CREATE DATABASE ITHelpDesk;
END
GO

USE ITHelpDesk;
GO

/* -------------------------------------------------------------------------- */
/* Users                                                                      */
/* Roles: user | admin | super_admin                                          */
/* approval_status: Pending | Approved | Rejected                             */
/* New registrations are inserted as Pending and cannot log in until Approved */
/* -------------------------------------------------------------------------- */

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Users (
    id               INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name             VARCHAR(255)      NOT NULL,
    email            VARCHAR(255)      NOT NULL UNIQUE,
    password         VARCHAR(255)      NOT NULL,  -- bcrypt hash
    employeeID       VARCHAR(50)       NOT NULL UNIQUE,
    department       VARCHAR(100)      NULL,
    branch           VARCHAR(100)      NULL,
    role             VARCHAR(20)       NOT NULL CONSTRAINT DF_Users_role DEFAULT ('user'),
    approval_status  VARCHAR(20)       NOT NULL CONSTRAINT DF_Users_approval DEFAULT ('Pending'),
    createdAt        DATETIME          NOT NULL CONSTRAINT DF_Users_createdAt DEFAULT (GETDATE()),
    resetOTP         VARCHAR(10)       NULL,      -- 6-digit OTP for forgot-password
    resetExpiry      DATETIME          NULL       -- OTP valid for 5 minutes
  );
END
GO

/* -------------------------------------------------------------------------- */
/* TicketSequence                                                             */
/* Used only to generate sequential ticket IDs: TKT-0001, TKT-0002, ...       */
/* INSERT DEFAULT VALUES; SELECT SCOPE_IDENTITY() AS ticketId                 */
/* -------------------------------------------------------------------------- */

IF OBJECT_ID(N'dbo.TicketSequence', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.TicketSequence (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY
  );
END
GO

/* -------------------------------------------------------------------------- */
/* Tickets                                                                    */
/* Status values used in the app: open | in progress | closed                 */
/* attachmentPath stores a relative path, e.g. uploads/tickets/<file>         */
/* -------------------------------------------------------------------------- */

IF OBJECT_ID(N'dbo.Tickets', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Tickets (
    id                    INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ticketNumber          VARCHAR(50)       NOT NULL UNIQUE,
    name                  VARCHAR(255)      NOT NULL,
    employeeID            VARCHAR(50)       NOT NULL,
    status                VARCHAR(50)       NOT NULL CONSTRAINT DF_Tickets_status DEFAULT ('open'),
    problemStatement      VARCHAR(MAX)      NULL,
    problem_dateOccurred  DATETIME          NULL,
    createdAt             DATETIME          NOT NULL CONSTRAINT DF_Tickets_createdAt DEFAULT (GETDATE()),
    updatedAt             DATETIME          NOT NULL CONSTRAINT DF_Tickets_updatedAt DEFAULT (GETDATE()),
    attachmentPath        VARCHAR(500)      NULL
  );
END
GO

/* Indexes used by list, search, stale-ticket, and login queries */

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Users_email' AND object_id = OBJECT_ID(N'dbo.Users'))
  CREATE INDEX IX_Users_email ON dbo.Users (email);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Users_employeeID' AND object_id = OBJECT_ID(N'dbo.Users'))
  CREATE INDEX IX_Users_employeeID ON dbo.Users (employeeID);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Tickets_employeeID' AND object_id = OBJECT_ID(N'dbo.Tickets'))
  CREATE INDEX IX_Tickets_employeeID ON dbo.Tickets (employeeID);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Tickets_ticketNumber' AND object_id = OBJECT_ID(N'dbo.Tickets'))
  CREATE INDEX IX_Tickets_ticketNumber ON dbo.Tickets (ticketNumber);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Tickets_status' AND object_id = OBJECT_ID(N'dbo.Tickets'))
  CREATE INDEX IX_Tickets_status ON dbo.Tickets (status);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Tickets_updatedAt' AND object_id = OBJECT_ID(N'dbo.Tickets'))
  CREATE INDEX IX_Tickets_updatedAt ON dbo.Tickets (updatedAt);
GO

/*
  Optional FK (not required by the app; Excel import can insert tickets
  even if employeeID is not in Users):

  ALTER TABLE dbo.Tickets
    ADD CONSTRAINT FK_Tickets_Users
    FOREIGN KEY (employeeID) REFERENCES dbo.Users (employeeID);
*/

/* -------------------------------------------------------------------------- */
/* Seed first Super Admin (edit values, then uncomment)                       */
/* Password must be a bcrypt hash generated by the app (bcrypt.hash, 10).     */
/* After seed, set approval_status = Approved so login works.                 */
/* -------------------------------------------------------------------------- */

/*
INSERT INTO dbo.Users (name, email, password, employeeID, department, branch, role, approval_status)
VALUES (
  N'Super Admin',
  N'admin@example.com',
  N'<bcrypt-hash-here>',
  N'SA001',
  N'IT',
  N'HO',
  N'super_admin',
  N'Approved'
);
*/

/* -------------------------------------------------------------------------- */
/* Useful maintenance queries                                                 */
/* -------------------------------------------------------------------------- */

-- Approve a pending user
-- UPDATE dbo.Users SET approval_status = 'Approved' WHERE employeeID = 'EMP001';

-- Delete a user (tickets are kept unless you also delete them)
-- DELETE FROM dbo.Tickets WHERE employeeID = 'EMP001';
-- DELETE FROM dbo.Users WHERE employeeID = 'EMP001';

-- Clear expired password-reset OTPs
-- UPDATE dbo.Users SET resetOTP = NULL, resetExpiry = NULL WHERE resetExpiry < GETDATE();
GO
