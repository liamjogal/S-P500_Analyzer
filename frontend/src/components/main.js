import {
  Label,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Chart from "./Chart";

export default function Main(props) {
  const [searchTerm, setSearchTerm] = useState("AAPL");
  const [articles, setArticles] = useState([]);
  const [titles, setTitles] = useState([]);

  const [results, setResults] = useState([]);

  const [data, setData] = useState(null);
  const [tickers, setTickers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showsearch, setShowsearch] = useState(false);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    setResults(
      tickers.filter((result) =>
        result.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/chart/AAPL?rang=ytd"
        );
        const jsonData = await response.json();
        var arrdata = [];
        for (let i = 0; i < jsonData["timestamps"].length; i++) {
          const currenttime = jsonData["timestamps"][i];
          const currentstat = jsonData["stats"][i];
          arrdata.push({ timestamp: currenttime, Price: currentstat });
        }
        setData(arrdata);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchTicks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/tickers");
        const jsonData = await response.json();
        setTickers(jsonData["tickers"]);
        setShowsearch(true);
      } catch (error) {}
    };

    const fetchNews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/news/AAPL`);
        const jsonData = await response.json();
        console.log(jsonData);

        setArticles(jsonData["articles"]);
        var titlelst = [];
        for (var indx in articles) {
          console.log(articles[indx]);
          titlelst.push({
            title: articles[indx]["title"],
            link: articles[indx]["url"],
          });
        }
        setTitles(jsonData["articles"]);
        console.log(titles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchTicks();
    fetchNews();
  }, []);

  const fetchStock = async () => {
    try {
      var selectElement = document.querySelector("#val-select");
      var output = selectElement.value;
      console.log(output);
      const response = await fetch(
        `http://127.0.0.1:8000/chart/${searchTerm}?rang=ytd&metric=${output}`
      );
      const jsonData = await response.json();
      var arrdata = [];
      for (let i = 0; i < jsonData["timestamps"].length; i++) {
        const currenttime = jsonData["timestamps"][i];
        const currentstat = jsonData["stats"][i];
        arrdata.push({ timestamp: currenttime, Price: currentstat });
      }
      setData(arrdata);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/news/${searchTerm}`);
      const jsonData = await response.json();

      setArticles(jsonData["articles"]);
      var titlelst = [];
      for (var indx in articles) {
        console.log(articles[indx]);
        titlelst.push({
          title: articles[indx]["title"],
          link: articles[indx]["url"],
        });
      }
      setTitles(titlelst);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const setSearch = (event) => {
    setSearchTerm(event.target.innerHTML);
    setResults([]);
  };

  const fetchall = () => {
    const fetchStock = async () => {
      try {
        var selectElement = document.querySelector("#val-select");
        var output = selectElement.value;
        console.log(output);
        const response = await fetch(
          `http://127.0.0.1:8000/chart/${searchTerm}?rang=ytd&metric=${output}`
        );
        const jsonData = await response.json();
        var arrdata = [];
        for (let i = 0; i < jsonData["timestamps"].length; i++) {
          const currenttime = jsonData["timestamps"][i];
          const currentstat = jsonData["stats"][i];
          arrdata.push({ timestamp: currenttime, Price: currentstat });
        }
        setData(arrdata);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/news/${searchTerm}`
        );
        const jsonData = await response.json();

        setArticles(jsonData["articles"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchNews();
    fetchStock();
    console.log(articles);
  };
  return (
    <div id="chart">
      <h2>{searchTerm} Data</h2>
      <Chart data={data}></Chart>

      {showsearch && (
        <div>
          <div class="row" padding="100px">
            {articles.map((title) => {
              return (
                <div align="center">
                  <div class="row">
                    <a align="center" href={title["url"]}>
                      {title["title"]}
                    </a>
                  </div>
                  {/* <div class="row">
                    <img
                      width="10px"
                      height="auto"
                      align="center"
                      src={title["urlToImage"]}
                    ></img>
                  </div> */}
                </div>
              );
            })}
          </div>
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
                  <div
                    className="dropdown-menu show"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {results.map((result, index) => (
                      <a
                        className="dropdown-item"
                        href="#"
                        key={index}
                        value={result}
                        onClick={setSearch}
                      >
                        {result}
                      </a>
                    ))}
                  </div>
                )}
              </Col>
              <Col>
                <select
                  id="val-select"
                  class="form-select"
                  aria-label="Default select example"
                >
                  <option selected value="close">
                    Close
                  </option>
                  <option value="adj.close">Adj. Close</option>
                  <option value="open">Open</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </Col>
              <Col>
                <Button onClick={fetchall}>Submit</Button>
              </Col>
            </Row>
            <Row></Row>
          </Container>
          <Container padding="100px"></Container>
        </div>
      )}
    </div>
  );
}
