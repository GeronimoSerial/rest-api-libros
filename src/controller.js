import { pool } from './database.js';

class LibroController {
    
  //Obtener todos los libros del database
  async getAll(req, res) {
      try {
        const [result] = await pool.query('SELECT * FROM `libros`');
        res.json(result);
      } catch (error) {
        console.log('Error al obtener todos los libros:', error);
      }  

    }
  //Obtener un solo libro del database
    async getOne(req, res) {
        const id = req.params.id;
        try {
          const [result] = await pool.query('SELECT * FROM Libros WHERE id = ?', [id]);
          if (result.length > 0) {
            res.json(result[0]);
          } else {
            res.status(404).json({"Error": 'Libro no encontrado en la base de datos en la base de datos' });
          }
        } catch (error) {
          console.error('Error al obtener el libro:', error);
        }
      }

   //Añadir un libro al database   
    async add(req,res){
      const libro = req.body;
     // fix subida atributos invalidos
      const listaAtributos = ['nombre', 'autor', 'categoria', 'añoPublicacion', 'ISBN'];
      const atributosExtra = Object.keys(libro).filter(attr => !listaAtributos.includes(attr));
  
      if (atributosExtra.length > 0) {
          return res.json({ error: `Atributos invalidos: ${atributosExtra.join(' , ')}` });
      }
       try {
          const [result] = await pool.query(`INSERT INTO Libros(nombre, autor, categoria, añoPublicacion, ISBN) VALUES(?, ?, ?, ?, ?)`, 
          [libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN]);
          res.json({"ID insertado": result.insertId});
      }catch (error) {
          console.log('Error al añadir el libro:',error);
      } 
  }
    //Eliminar por ISBN Un libro del database
    async deleteIsbn(req, res){
      try {
        const ISBN = req.params.ISBN;
        const [result] = await pool.query('DELETE FROM Libros WHERE ISBN=(?)', [ISBN]);
        res.json({"Registros Eliminados": result.affectedRows});
      } catch (error) {
          console.log('Error al eliminar por ISBN:', error);
      }  

     }

     //Actualizar libros del database;
    async update(req,res){
        try {
          const libro = req.body;
          const [result] = await pool.query(`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), añoPublicacion=(?), ISBN=(?) WHERE id=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN, libro.id]);
          res.json({"Registros actualizados": result.changedRows});
        } catch (error) {
            console.log('Error al actualizar el libro: ', error);  
        }
     }
}

export const libros = new LibroController();