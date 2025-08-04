-- Delete User by Employee ID
-- Replace 'EMPLOYEE_ID_HERE' with the actual employee ID you want to delete

DELETE FROM Users 
WHERE employeeID = 'EMPLOYEE_ID_HERE';

-- Example with specific employee ID:
-- DELETE FROM Users WHERE employeeID = 'EMP001';

-- To verify the user exists before deleting:
-- SELECT * FROM Users WHERE employeeID = 'EMPLOYEE_ID_HERE';

-- To delete multiple users (be careful with this):
-- DELETE FROM Users WHERE employeeID IN ('EMP001', 'EMP002', 'EMP003');

-- To delete user and also delete their tickets (if you want to cascade delete):
-- DELETE FROM Tickets WHERE employeeID = 'EMPLOYEE_ID_HERE';
-- DELETE FROM Users WHERE employeeID = 'EMPLOYEE_ID_HERE'; 