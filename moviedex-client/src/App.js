import React from 'react';
import './App.css';

class App extends React.Component {

  constructor( props ){
    super( props );
    this.state = {
      peliculas : [],
      title:"",
      year:"",
      rating:""
    }

  }

  showMovies=()=>{
    let url = "/api/moviedex";
          let settings = {
              method: "GET"
          }
          fetch(url, settings)
              .then(response => {
                  if (response.ok) {
                      return response.json();
                  }
                  throw new Error(response.statusText);
              })
              .then(responseJSON => {
                  console.log("get all movies",responseJSON);
                  this.handleShowMovies(responseJSON);
              })
              .catch(error => {
                  console.log(error);
              })
  }

  handleShowMovies=(response)=>{
    this.setState={
      peliculas: response
    }
  }

  handleChange = (event) =>{
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  componentDidMount =() =>{
    this.showMovies();
  }

  addMovie = (event) =>{
    console.log("adding a movie");
    const { title, year, rating } = this.state;
    event.preventDefault();

    let url = "http://localhost:8080/api/moviedex";

    let settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        film_title: title,
        year: year,
        rating: rating
      })
    };

    fetch(url, settings)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJSON => {
        this.handleNewMovie(responseJSON);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleNewMovie = (response) =>{
    this.showMovies();
  }

  render(){
    return (
      <div>
        <ul>
        {this.state.peliculas.map((pel, i) => {
              return (
                      <li>
                      <p>Title: {pel.film_title}</p>
                      <p>Year: {pel.year} </p>
                      <p>Rating: {pel.rating}</p>
                      </li>
              )})}
        </ul>

        <div>
          <h3>Add movie</h3>
          <p>Title: <input type="text" name="title" onChange={this.handleChange}></input></p>
          <p>Year: <input type="text" name="year" onChange={this.handleChange}></input> </p>
          <p>Rating: <input type="text" name="rating" onChange={this.handleChange}></input> </p>
          <button type="button" onClick={this.addMovie}></button>
        </div>
      </div>
    );
  }
}

export default App;
