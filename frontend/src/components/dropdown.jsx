import React, { useState } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const SearchDropdown = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  console.log(props.data)
  const [results, setResults] = useState(props.data);


  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    // Perform your search logic here and update the 'results' state
    // based on the search term.
    // You can use APIs or any other method to fetch the search results.

    // Example: Mocked search results
    
    setResults(props.data.filter(result => result.toLowerCase().includes(value.toLowerCase())));
  };

  return (
      
      <Container>
        <Row>
          <Col>

            <input
        type="text"
        className="form-control"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
      />
      {searchTerm && (
        <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
          {results.length > 0 ? (
            results.map((result, index) => (
              <a className="dropdown-item" href="#" key={index}>
                {result}
              </a>
            ))
          ) : (
            <a className="dropdown-item disabled" href="#">
              No results found.
            </a>
          )}
        </div>
      )}
          </Col>
          <Col>
            <Button>Submit</Button>
          </Col>
        </Row>
      </Container>
  
  );
};

export default SearchDropdown;
