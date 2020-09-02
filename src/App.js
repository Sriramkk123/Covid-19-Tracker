import React , {useState, useEffect} from 'react';
import './App.css';
import {MenuItem,FormControl,Select,Card,CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData,prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
function App() {
  //https://disease.sh/v3/covid-19/countries


  const [countries,setCountries] = useState([]);
  const [country,setInputCountry] = useState("Worldwide");
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");

  useEffect(() =>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) =>{
      setCountryInfo(data);
    });
  },[]);

  useEffect(()=>{
    const getCountriesData = async() =>{
     await fetch('https://disease.sh/v3/covid-19/countries')
     .then((response) => response.json())
     .then((data) =>{
       const countries = data.map((country) =>(
         {
          name: country.country,
          value: country.countryInfo.iso2
         }
       ));
       const sortedData = sortData(data)
       setTableData(sortedData);
       setMapCountries(data);
       setCountries(countries);
     });
    };
    getCountriesData();
  },[]);


  const onCountryChange = async(event) =>{
    const countryCode = event.target.value;

    const url = countryCode === "Worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then((data) =>{
      setInputCountry(countryCode);
      setCountryInfo(data);
      //console.log(data.countryInfo.lat,data.countryInfo.long)
      if(url.includes('https://disease.sh/v3/covid-19/all'))
        setMapCenter([34.80746,-40.4796])
      else
        setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
    });
  };

  //console.log('info',countryInfo);
  //console.log("Countries",countries);
  return (
    <div className="App">
      <div className = "app_left">
      <div className = "app_header">
      <h1>COVID-19 TRACKER</h1>
      {/*Header*/}
       {/*Title + Dropdown*/}
      <FormControl  className = "app_dropdown"> 
        <Select
          variant = "outlined"
          onChange = {onCountryChange}
          value = {country}>
            <MenuItem value = "Worldwide">Wordlwide</MenuItem>
            {
              countries.map(country =>(
                  <MenuItem value = {country.value}  key = {country}>{country.name} </MenuItem>
              ))
            }    
        </Select>
      </FormControl>
      {/*InfoBox*3*/}
      {/*Table*/}
      {/*Graph*/}
      {/*Map*/}
      </div>
      <div className = "app_stats">
            <InfoBox
            isRed
            active = {casesType === "cases"}
            onClick = {e => setCasesType("cases")} 
            title = "Coronavirus cases" 
            cases = {prettyPrintStat(countryInfo.todayCases)} 
            total ={prettyPrintStat(countryInfo.cases)}
            />
            <InfoBox 
            active = {casesType === "recovered"}
            onClick = {e => setCasesType("recovered")} 
            title = "Recovered" 
            cases = {prettyPrintStat(countryInfo.todayRecovered)} 
            total ={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox 
            isRed
            active = {casesType === "deaths"}
            onClick = {e => setCasesType("deaths")} 
            title = "Deaths" 
            cases = {prettyPrintStat(countryInfo.todayDeaths)} 
            total ={prettyPrintStat(countryInfo.deaths)}
            />
      </div>
      <Map 
      casesType = {casesType}
      countries = {mapCountries}
      center = {mapCenter}
      zoom = {mapZoom}/>
      </div>
      <Card className = "app_right">
          <CardContent>
            <h3>Live cases by country</h3>
            <Table countries=  {tableData} />
            <h3 className = "app_graph_title">Worldwide new {casesType}</h3>
            <LineGraph className = "app_graph"casesType = {casesType}/>
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
