import { pool } from './database.js';

class LibroController {
    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM `libros`');
        res.json(result);
    }

    async getOne(req, res) {
        const id = req.params.id;
        try {
          const [result] = await pool.query('SELECT * FROM Libros WHERE id = ?', [id]);
          if (result.length > 0) {
            res.json(result[0]);
          } else {
            res.status(404).json({"Error": 'Libro no encontrado en la base de datos' });
          }
        } catch (error) {
          console.error('Error al obtener el libro:', error);
        }
      }

    async add(req,res){
        const libro = req.body;
        const [result] = await pool.query(`INSERT INTO Libros(nombre, autor, categoria, añoPublicacion, ISBN) VALUES(?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN]);
        res.json({"ID insertado": result.insertId});
    }

    //  async deleteId(req,res){
    //     const libro = req.body;
    //     const [result] = await pool.query(`DELETE FROM Libros WHERE id=(?)`, [libro.id]);
    //     res.json({"Registros eliminados": result.affectedRows});
    // }

    async deleteIsbn(req, res){
        const ISBN = req.params.ISBN;
        const [result] = await pool.query('DELETE FROM Libros WHERE ISBN=(?)', [ISBN]);
        res.json({"Registros Eliminados": result.affectedRows});
      }

    async update(req,res){
        const libro = req.body;
        const [result] = await pool.query(`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), añoPublicacion=(?), ISBN=(?) WHERE id=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN, libro.id]);
        res.json({"Registros actualizados": result.changedRows});
    }
   
    
}

export const libros = new LibroController();