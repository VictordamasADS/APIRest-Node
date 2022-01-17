const mysql = require('mysql')

//connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'minhaloja'
})

//views products
exports.view = (req, res) => {
    
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as ID' + connection.threadId);

        connection.query('SELECT * FROM produtos', (err, rows) => {
            connection.release();

            if(!err) {
                res.render("home.handlebars", { rows }); 
            } else {
                console.log(err)
            }
        })
    }) 
}


// find products in search
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as ID' + connection.threadId);

        // id de pesquisa
        let searchTerm = req.body.search;


        connection.query('SELECT * FROM produtos WHERE id LIKE ? OR nome LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            connection.release();

            if(!err) {
                res.render("home.handlebars", { rows }); 
            } else {
                console.log(err)
            }
        })
    }) 
}

exports.form = (req, res) => {
    res.render("form.handlebars"); 
}

//adicionar
exports.create = (req, res) => {
    const { id, nome, unidade, preco, categoria } = req.body;
    
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as ID' + connection.threadId);

        connection.query('INSERT INTO produtos SET id = ?, nome = ?, unidade = ?, preco = ?, categoria = ?', [id, nome, unidade, preco, categoria], (err, rows) => {
            connection.release();

            if(!err) {
                res.render("form.handlebars", { alert: 'Produto adicionado com sucesso!' }); 
            } else {
                console.log(err)
            }
        })
    })
}

//edit
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as ID' + connection.threadId);


        connection.query('SELECT * FROM produtos WHERE id = ?', [req.params.id],(err, rows) => {
            connection.release();

            if(!err) {
                res.render("edit.handlebars", { rows }); 
            } else {
                console.log(err)
            }
        })
    }) 
}

//update
exports.update = (req, res) => {

    const { nome, unidade, preco, categoria } = req.body;

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as ID' + connection.threadId);


        connection.query('UPDATE produtos SET nome = ?, unidade = ?, preco = ?, categoria = ? WHERE id = ?', [nome, unidade, preco, categoria, req.params.id] ,(err, rows) => {
            connection.release();

            if(!err) {              
                pool.getConnection((err, connection) => {
                    if(err) throw err;
                    console.log('connected as ID' + connection.threadId);
            
            
                    connection.query('SELECT * FROM produtos WHERE id = ?', [req.params.id],(err, rows) => {
                        connection.release();
            
                        if(!err) {
                            res.render("edit.handlebars", { rows, alert: `O produto foi atualizado com sucesso!` }); 
                        } else {
                            console.log(err)
                        }
                    })
                })
            } else {
                console.log(err)
            }
        })
    }) 
}


//deletar
exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as ID' + connection.threadId);


        connection.query('DELETE FROM produtos WHERE id = ?', [req.params.id],(err, rows) => {
            connection.release();

            if(!err) {
                res.redirect("/"); 
            } else {
                console.log(err)
            }
        })
    }) 
}