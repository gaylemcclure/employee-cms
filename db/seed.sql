INSERT INTO department (id, name) 
    VALUES
    (1, 'IT'),
    (2, 'Marketing'),
    (3, 'Sales');

INSERT INTO role (id, title, salary, department_id) 
    VALUES
    (1, 'Front End Developer', 30000, 1),
    (2, 'Back End Developer', 32000, 1),
    (3, 'Marketing Assistant', 20000, 2),
    (4, 'Marketing Manager', 30000, 2),
    (5, 'Sales Associate', 22000, 3),
    (6, 'Sales Manager', 32000, 3);

INSERT INTO employee (id, first_name, last_name, role_id)
    VALUES
    (1, 'Gayle', 'McClure', 1),
    (2, 'Fred', 'Flintstone', 2),
    (3, 'Tom', 'Waits', 3),
    (4, 'Jon', 'Jonson', 4),
    (5, 'Patti', 'Smith', 5),
    (6, 'Joan', 'Jett', 6);