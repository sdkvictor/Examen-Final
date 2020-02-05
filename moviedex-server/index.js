let express = require( 'express' );
let bodyParser = require( 'body-parser' );
let mongoose = require( 'mongoose' );
let jsonParser = bodyParser.json();
let { DATABASE_URL, PORT } = require( './config' );
//let {movieController} = require('./model');
//let uuid = require( 'uuid/v4' );


let app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
	if (req.method === "OPTIONS") {
		return res.send(204);
	}
	next();
});

app.post("/api/moviedexpost", jsonParser, (req, res) => {
	let { film_title, year, rating } = req.body;
  
	if (film_title == undefined || year == undefined || rating == undefined) {
	  res.statusMessage = "No se han recibido los parametros completos";
	  return res.status(406).send();
	}
  
	let newMovie = {
		film_title: film_title,
		year: year,
		rating: rating,
		film_ID: uuid()
	};
  
	movieController
	  .create(newMovie)
	  .then(movie => {
		  console.log(uuid());
		res.statusMessage = "Pelicula agregada a la lista";
		return res.status(201).json(movie);
	  })
	  .catch(err => {
		res.statusMessage = "Error al añadir nueva pelicula";
		return res.status(500).send(newMovie);
	  });
  });


  app.get('/api/moviedex', (req, res) => {
	mmovieController
	.getAll()
        .then(movies => {
            return res.status(200).json(movies)
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Hubo un error al obtener peliculas de la BD";
            return res.status(500).send();
        });
});

let server;

function runServer( port, databaseUrl ){
	return new Promise( (resolve, reject ) => {
		mongoose.connect( databaseUrl,  { useNewUrlParser: true, useUnifiedTopology: true  }, response => {
			if ( response ){
				return reject( response );
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then( () => {
			return new Promise( (resolve, reject) => {
				console.log( 'Closing the server' );
				server.close( err => {
					if ( err ){
						return reject( err );
					}
					else{
						resolve();
					}
				});
			});
		});
}
runServer( PORT, DATABASE_URL );

module.exports = { 
    app, 
    runServer, 
    closeServer 
}