const express = require('express');
const methodOverride = require('method-override');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

let user='Null';
let oid=0;
let data_history={};
conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sam pharmacy'
})
const delsql = 'INSERT INTO `users`( `f_name`, `l_name`, `phone_no`, `address`, `user_email`, `user_password`) VALUES (?,?,?,?,?,?)';
const addDrug='INSERT INTO `drugs`(`drug_id`, `drug_name`, `issue_date`, `expiry_date`, `active_subs`, `purpose`,`price`, `category`, `dose`, `stock`,  `side_effects`) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
const updatesql = 'UPDATE `users` SET `fname`=?,`lname`=?,`number`=?,`address`=?,`email`=?,`password`=? WHERE `id` = ?';
const historysql="SELECT o.*, i.*, d.* FROM orders AS o JOIN items AS i ON o.Oid = i.Oid JOIN drugs AS d ON i.drug_id = d.drug_id WHERE o.checkout=1 AND o.user_email =? ORDER BY O.oid DESC";
const cartsql="SELECT d.drug_name,d.drug_id, d.price ,i.no_items FROM orders AS o JOIN items AS i ON o.Oid = i.Oid JOIN drugs AS d ON i.drug_id = d.drug_id WHERE o.checkout=0 AND o.user_email =?";
const retrieveDrugs  = "SELECT * FROM drugs WHERE drug_name like ?";
const check_user='SELECT * FROM `users` WHERE user_email =? AND  user_password=? ';
const del_cart="DELETE FROM items WHERE drug_id = ? AND Oid=?";
const updateCheckout = `UPDATE orders SET checkout = 1 WHERE user_email = ? AND checkout = 0;`; 
const deleteOrders = `DELETE FROM orders WHERE user_email = ? AND oid=?;`;
const deleteItems = `DELETE items FROM items JOIN orders ON items.oid = orders.oId WHERE  orders.user_email = ? AND orders.oid=? ;`;
const oid_get="SELECT oid FROM orders where checkout= ? and user_email = ?  ;"
const oid_make="SELECT MAX(oid) AS max_oid FROM orders;"
const addtoorders = 'INSERT INTO orders(Oid, user_email) VALUES (?,?)';
const check_exist="SELECT oid FROM orders where oid=?;"
const addtoitems = 'INSERT INTO items(Oid, drug_id) VALUES (?,?)';

// Connect to MySQL
conn.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', conn.threadId);
});


app.use(express.urlencoded({ extended: true }));
// configure methodOverride
app.use(methodOverride('_method'));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.send(__dirname + '/index.html');
  console.log("11111111111111111111111111111")
});
function logout() {
  // Clear session or authentication data (this would typically be done server-side)
  // For example, using localStorage for demo purposes:
  localStorage.removeItem('authToken');
  // Redirect to index.html
  window.location.href = 'index.html';  // Clear browser history to prevent back navigation
  setTimeout(function () {
      history.pushState(null, '', 'index.html');
      window.addEventListener('popstate', function () {
          history.pushState(null, '', 'index.html');
      });
  }, 0);
};

app.get('/logout', function(req, res) {
  console.log("recieved");
  logout();
  user=null;
  oid=0;
});
app.get('/sign-in', (req, res) => {
  console.log("recieved");
  res.sendFile(__dirname + '/sign-in.html');
});

app.get('/cart', (req, res) => {
  console.log("recieved");
  res.sendFile(__dirname + '/checkout-final.html');
});
app.get('/cart/data', (req, res) => {
  
  console.log("user", user);

  conn.query(cartsql, [user], (err, result) => {
      if (err) {
          console.error('Error fetching data:', err);
          res.status(500).send({ message: 'Error fetching data' });
          return;
      }
      res.status(200).json(result);
      console.log("result", result);
  });
});

app.post('/cart_del', (req, res) => {
  const { id }= req.body;
  order=oid;
  console.log("Deleting item with ID:",id, "and OID:", oid);

  conn.query(del_cart, [id, oid], (err, result) => {
      if (err) {
          console.error('Error deleting data:', err);
          res.status(500).send({ message: 'Error deleting item' });
          return;
      }
      res.status(200).send({ message: 'Item deleted successfully' });
  });
});
app.post('/categories', (req, res) => {
  // Query distinct categories from database
  let {searchsql, name} = req.body;
  name="%"+name+"%";
  console.log(searchsql)
  conn.query(searchsql,[name] ,(err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      //alert('Error inserting data');
      return;
    };
    console.log("result",results)
    res.status(200).json(results);
  });
});



app.post('/addtocart', (req, res) => {
  const { id } = req.body; // Ensure oid and user are included in the request body

  console.log('Adding to orders:', oid, user);
  
  conn.query(check_exist, [oid], (err, results) => {
    if (err) {
      console.error('Error checking existence:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results[0] == null) {
      conn.query(addtoorders, [oid, user], (err, results) => {
        if (err) {
          console.error('Error inserting into orders:', err);
          return res.status(500).json({ error: 'Database error' });
        }
      });
    }

    conn.query(addtoitems, [oid, id], (err, results) => {
      if (err) {
        console.error('Error inserting into items:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      console.log('Result:', results);
     res.send(`
        <script>
          alert('Wrong password');
          window.location.href = '/sign-in.html';
        </script>
      `)
    });
  });
});


// // Clear cart
app.get('/cart_check', (req, res) => {
  // const user = req.query.user; // Ensure user is passed in the query
  // const userEmail = req.query.userEmail; // Ensure userEmail is passed in the query
  conn.query(updateCheckout, user, (err, result) => {
    if (err) {
      console.error('Error deleting items:', err);
      res.status(500).send({ message: 'Error deleting items' });
      return;
    }
      res.status(200).json({ message: 'checked out' });
      oid+=1;
    });
  });
app.get('/cart_clear', (req, res) => {
  // const user = req.query.user; // Ensure user is passed in the query
  // const userEmail = req.query.userEmail; // Ensure userEmail is passed in the query
  conn.query(deleteItems, [user, oid], (err, result) => {
    if (err) {
      console.error('Error deleting items:', err);
      res.status(500).send({ message: 'Error deleting items' });
      return;
    }
    conn.query(deleteOrders, [user, oid], (err, result) => {
      if (err) {
        console.error('Error deleting orders:', err);
        res.status(500).send({ message: 'Error deleting orders' });
        return;
      }
      res.status(200).json({ message: 'Cart cleared' });
    });
  });
});

app.post('/check-user', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  user = email;
  conn.query(check_user, [email, password], (err, result) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).send('Error retrieving data');
      return;
    }

    if (result.length !== 0) {
      if (result[0].is_employer == 0) {
        res.status(200).sendFile(__dirname + "/search-by-drugs.html"); // Assuming result[0].is_employer is the correct way to access the is_employer field
        console.log("result", result);
        conn.query(oid_get, [0, user], (err, oresult) => {
          if (err) {
            console.error('Error retrieving data:', err);
            res.status(500)
            return;
          }console.log(1,oresult)
          if (oresult.length !== 0 ) {
            oid = oresult[0].oid;
            console.log(oid);
            
          } else {
            conn.query(oid_make, (err, mresult) => {
              if (err) {
                console.error('Error retrieving data:', err);
                res.status(500)
                return;
              }
              oid = parseInt(mresult[0].max_oid)+1;
              console.log(oid);
              // res.status(200).sendFile(__dirname + "/search-by-drugs.html");
            });
          }
        });
      } else {
        res.status(200).sendFile(__dirname + "/add.html");
      }
    } else {
      res.status(401).send(`
        <script>
          alert('Wrong password');
          window.location.href = '/sign-in.html';
        </script>
      `);
    }
  });
});


app.post('/adduser', (req, res) => {
  const {fname, lname, number, address, email, password} = req.body;
  user=email
  conn.query(delsql, [fname, lname, number, address, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      //alert('Error inserting data');
      return;
    }

    //alert('Data inserted successfully');
    res.sendFile(__dirname + '/search-by-drugs.html');
  });
});

app.post('/addDrug', (req, res) => {
  const {drug_id, drug_name, issue_date, expiry_date,active_subs, purpose,price,category,dose, stock,side_effects} = req.body;
  conn.query(addDrug, [drug_id, drug_name, issue_date, expiry_date,active_subs, purpose,price,category,dose, stock,side_effects], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      //alert('Error inserting data');
      return;
    }

    //alert('Data inserted successfully');
    res.sendFile(__dirname + '/add.html');
  });
});
app.get('/history', (req, res) => {
      res.sendFile(__dirname + '/history.html');
  });

app.get('/history/data', (req, res) => {
  console.log(user);

  conn.query(historysql, user, (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          return;
      }
      // console.log(result)
      res.status(200).json(result);
      console.log(result);
  });
});

app.get('/update', (req, res) => {
      res.sendFile(__dirname + '/update.html');
  });
  
app.post('/update/getdrug', (req, res) => {
  let {name} = req.body;
  name="%"+name+"%";
  console.log(name)
  conn.query(retrieveDrugs, [name], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      //alert('Error inserting data');
      return;
    };
    console.log("resul",result)
    res.status(200).json(result);
  });
});
  



app.put('/update', (req, res) => {
  const {name, lname, number, address, email, password} = req.body;
  conn.query(updatesql, [fname, lname, number, address, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      //alert('Error inserting data');
      return;
    }
    //alert('Data inserted successfully');
    
  });


})

app.delete('/deleteProduct', (req, res) => {
  res.send('Delete Home page');
})

app.patch('/', (req, res) => {
  res.send('Patch Home page');
})

app.listen(3000, () => console.log("listening on port ' http://127.0.0.1:3000/'..."));