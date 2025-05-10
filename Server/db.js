import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

sqlite3.verbose();

const db = await open({
  filename: './theformula.sqlite', // o el nombre que hayas usado
  driver: sqlite3.Database
});

export default db;
