import fs from 'fs';
import path from 'path';

import pool from '../db/users/mysql.js'; // Change as needed
const sqlPath = path.resolve('./db/users/schema.sql'); // Change as needed

async function initDatabase() {
	try {
		const sql = fs.readFileSync(sqlPath, 'utf8');

		const connection = await pool.getConnection();
		const queries = sql
			.split(';')
			.map((q) => q.trim())
			.filter((q) => q.length > 0);

		for (let query of queries) {
			const tableMatch = query.match(/create table `([a-zA-Z0-9_]+)`/i);
			if (!tableMatch) continue;

			const tableName = tableMatch[1];
			const [existingTables] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);

			if (existingTables.length === 0) {
				console.log(`Creating table: ${tableName}`);
				await connection.query(query);
			} else {
				console.log(`Table already exists: ${tableName}`);

				// Get current columns in the table
				const [existingColumnsRows] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
				const existingColumns = existingColumnsRows.map((row) => row.Field);

				// Extract column definitions from the CREATE TABLE query
				const columnDefsMatch = query.match(/\(([\s\S]+)\)/);
				if (!columnDefsMatch) continue;

				const columnDefsRaw = columnDefsMatch[1];
				const columnDefs = [];
				let currentDef = '';
				let parenDepth = 0;

				for (const ch of columnDefsRaw) {
					if (ch === '(') parenDepth += 1;
					if (ch === ')') parenDepth = Math.max(0, parenDepth - 1);

					if (ch === ',' && parenDepth === 0) {
						if (currentDef.trim().length > 0) {
							columnDefs.push(currentDef.trim());
						}
						currentDef = '';
						continue;
					}

					currentDef += ch;
				}

				if (currentDef.trim().length > 0) {
					columnDefs.push(currentDef.trim());
				}

				const filteredColumnDefs = columnDefs.filter((col) => col.startsWith('`'));

				for (let colDef of filteredColumnDefs) {
					const columnNameMatch = colDef.match(/`([a-zA-Z0-9_]+)`/);
					if (!columnNameMatch) continue;

					const columnName = columnNameMatch[1];

					if (!existingColumns.includes(columnName)) {
						const alterQuery = `ALTER TABLE \`${tableName}\` ADD COLUMN ${colDef}`;
						console.log(`Adding missing column '${columnName}' to '${tableName}'`);
						await connection.query(alterQuery);
					}
				}
			}
		}

		connection.release();
		console.log('✅ Tables checked/created successfully!');
		process.exit(0);
	} catch (err) {
		console.error('❌ Error initializing database:', err);
		process.exit(1);
	}
}

initDatabase();
