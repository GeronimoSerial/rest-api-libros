import { pool } from './database.js';

class LibroController {
    
  //Obtener todos los libros del database
    async getAll(req, res) {
        try {
          const [result] = await pool.query('SELECT * FROM `libros`');
          res.json(result);
        }catch (error) {
          console.error('Error al obtener todos los libros:', error);
        }  

    }
  //Obtener un solo libro del database
    async getOne(req, res) {
        try{
          const id = req.params.id;
          const [result] = await pool.query('SELECT * FROM Libros WHERE id = ?', [id]);
          if (result.length > 0) {
            res.json(result[0]);
          } else {
            res.json({"Error": 'Libro no encontrado en la base de datos' });
          }
       } catch (error) {
          console.error('Error al obtener el libro:', error);
        }
      }

   //Añadir un libro al database   
    async add(req,res){ 
        try{
          const libro = req.body;
        // fix subida atributos invalidos
          const listaAtributos = ['nombre', 'autor', 'categoria', 'añoPublicacion', 'ISBN'];
          const atributosExtra = Object.keys(libro).filter(attr => !listaAtributos.includes(attr));
      
          if (atributosExtra.length > 0) {
            return res.json({ error: `Atributos invalidos: ${atributosExtra.join(' , ')}` });
          }

          const [result] = await pool.query(`INSERT INTO Libros(nombre, autor, categoria, añoPublicacion, ISBN) VALUES(?, ?, ?, ?, ?)`, 
          [libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN]);
              
          res.json({"ID insertado": result.insertId});
          
        }catch (error) {
          console.error('Error al añadir el libro:',error);
          } 
  }
    //Eliminar por ISBN Un libro del database
    async deleteIsbn(req, res){
      try {
        const libro = req.body;
        const [result] = await pool.query('DELETE FROM Libros WHERE ISBN = (?)', [libro.ISBN]);
        if (result.affectedRows > 0) {
          res.json({"Registros Eliminados": result.affectedRows});
        }else{
          res.json({error: `No se encontro ningun libro con el ISBN: ${libro.ISBN}`});
        }
      } catch (error) {
          console.error('Error al eliminar por ISBN:', error);
      }  

     }

    //Actualizar libros del database;
    async update(req,res){
        try {
          const libro = req.body;
          const [result] = await pool.query(`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), añoPublicacion=(?), ISBN=(?) WHERE id=(?)`,
           [libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN, libro.id]);
          res.json({"Registros actualizados": result.changedRows});
        } catch (error) {
            console.error('Error al actualizar el libro: ', error);  
        }
     }
}

export const libros = new LibroController();