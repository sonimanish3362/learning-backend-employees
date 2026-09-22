
const db = require("../config/database");
const getEmployees = (req, res) => {

    const {
        search,
        page = 1,
        limit = 5,
        sortBy = "id",
        order = "asc"
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const offset = (pageNumber - 1) * limitNumber;

    const allowedSortColumns = [
        "first_name",
        "last_name",
        "email",
        "department",
        "salary"
    ];

    const selectedSortBy = allowedSortColumns.includes(sortBy)
        ? sortBy
        : "id";

    const selectedOrder =
        order.toLowerCase() === "desc"
            ? "DESC"
            : "ASC";

    let sql = "SELECT * FROM employees";
    let values = [];

    let countSql = "SELECT COUNT(*) AS total FROM employees";
    let countValues = [];

    if (search) {

        const searchValue = `%${search}%`;

        sql = `
            SELECT * FROM employees
            WHERE first_name LIKE ?
            OR last_name LIKE ?
            OR email LIKE ?
            OR department LIKE ?
            ORDER BY ${selectedSortBy} ${selectedOrder}
            LIMIT ? OFFSET ?
        `;

        values = [
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            limitNumber,
            offset
        ];

        countSql = `
            SELECT COUNT(*) AS total
            FROM employees
            WHERE first_name LIKE ?
            OR last_name LIKE ?
            OR email LIKE ?
            OR department LIKE ?
        `;

        countValues = [
            searchValue,
            searchValue,
            searchValue,
            searchValue
        ];

    } else {

        sql = `
            SELECT * FROM employees
            ORDER BY ${selectedSortBy} ${selectedOrder}
            LIMIT ? OFFSET ?
        `;

        values = [
            limitNumber,
            offset
        ];

        countSql = `
            SELECT COUNT(*) AS total
            FROM employees
        `;
    }

    db.query(sql, values, (err, results) => {

        if (err) {
            console.log("Error fetching employees:", err);

            return res.status(500).json({
                error: "Internal Server Error"
            });
        }

        db.query(countSql, countValues, (countErr, countResult) => {

            if (countErr) {
                console.log("Error counting employees:", countErr);

                return res.status(500).json({
                    error: "Internal Server Error"
                });
            }

            const total = countResult[0].total;

            const totalPages = Math.ceil(
                total / limitNumber
            );

            return res.status(200).json({
                data: results,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total: total,
                    totalPages: totalPages
                }
            });
        });
    });
};

const createEmployee = (req, res) => {
    const {
        first_name,
        last_name,
        email,
        phone,
        department,
        salary
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO employees
        (first_name, last_name, email, phone, department, salary, images)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            first_name,
            last_name,
            email,
            phone,
            department,
            salary,
            image
        ],
        (err, results) => {

            if (err) {
                console.log("Error creating employee:", err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                return res.status(500).json({
                    error: "Internal Server Error"
                });
            }

            return res.status(201).json({
                message: "Employee created successfully",
                employeeId: results.insertId,
                image: image
            });
        }
    );
};

const updateEmployee = (req, res) => {
    const { id } = req.params;
    const {
        first_name,
        last_name,
        email,
        phone,
        department,
        salary
    } = req.body;

    const sql = `
        UPDATE employees
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            phone = ?,
            department = ?,
            salary = ?
        WHERE id = ?
    `;

    db.query(sql, [first_name, last_name, email, phone, department, salary, id], (err, results) => {
        if (err) {
            console.log('Error updating employee:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.status(200).json({ message: 'Employee updated successfully' });
        }
    })
}

const deleteEmployee = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log('Error deleting employee:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.status(200).json({ message: 'Employee deleted successfully' });
        }
    })
}



module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee };