import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from './MovieCard/MovieCard.jsx';
import MovieModal from './MovieModal/MovieModal.jsx';
import './App.css';
import logo from './assets/TRI.jpeg';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=38ea5e7c8561a585923cb35fd520dfa3&page=${page}`);
      setMovies(prevMovies => {
        // Filter out duplicate movies
        const newMovies = response.data.results;
        const allMovies = [...prevMovies, ...newMovies];
        const uniqueMovies = Array.from(new Set(allMovies.map(movie => movie.id)))
          .map(id => {
            return allMovies.find(movie => movie.id === id);
          });
        return uniqueMovies;
      });
      setHasMore(response.data.results.length > 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header>
        <img src={logo} alt="Logo" className="logo" />
        <h1>UPCOMING MOVIES</h1>
        <input
          className='search'
          type="text"
          placeholder="Search for a movie :)"
          value={searchTerm}
          onChange={handleSearch}
        />
      </header>
      <InfiniteScroll
        dataLength={filteredMovies.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>All movies loaded</p>}
      >
        <div className="movie-grid">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id} // Use only movie.id for uniqueness
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      </InfiniteScroll>
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;
