function App() {

    const [countryData, setCountryData] = React.useState([]);
    const [dataType, setDataType] = React.useState("casesPerOneMillion");
    


    React.useEffect(() => {

        async function getCovidInfo() {
            // method body
            try{
                const response = await fetch("https://disease.sh/v3/covid-19/countries?sort=" + dataType);
                const data= await response.json();
                setCountryData(data);
                
            } catch (error) {
            console.error('Error fetching data:', error);
          }
        }

        getCovidInfo();


    }, [dataType]);

    return (
        <div className="App">
            <h1 id="header">Covid Statistics</h1>
            <select name="datatype" id="datatype" onChange={(event) => setDataType(event.target.value)} value={dataType}>
                <option value="casesPerOneMillion">Cases Per One Million</option>
                <option value="cases">Cases Total</option>
                <option value="deaths">Deaths</option>
                <option value="tests">Tests</option>
                <option value="deathsPerOneMillion">Deaths Per One Million</option>
            </select>

            <h2>Hover over graph to see data</h2>
            
            <div className="visHolder">
                <BarChart data={countryData} height={500} widthOfBar={12} width={countryData.length * 6} dataType={dataType}/>
            </div>
            
        </div>
      );

    
}


function BarChart({data, height, width, widthOfBar, dataType}) {

    console.log(data)

    React.useEffect(() => {
        createBarChart();
    }, [data]);

    const createBarChart = () => {

        const covidData = data.map((country) => country[dataType]);
        const countries = data.map(country => country.country);
        const dataMax = d3.max(covidData)

        let tooltip = d3.select(".visHolder").append("div").attr("id", "tooltip").style("opacity", 0);

        const yScale = d3.scaleLinear().domain([0, dataMax]).range([0, height]);
        
        d3.select("svg").selectAll("rect").data(covidData).enter().append("rect")


        d3.select("svg")
        .selectAll("rect")
        .data(covidData)
        .style("fill", (d, i) => (i % 2 == 0 ? "#9b111e": "#D03D56" )) // 
        .style("margin-left", "30px")
        .attr("x", (d, i) => i * (widthOfBar + 2))
        .attr("y", (d) => height - yScale(d + dataMax * 0.1))
        .attr("height", (d, i) => yScale(d + dataMax * 0.1))
        .attr("width", widthOfBar)
        .on("mouseover", (d, i) => {
            tooltip.style("opacity", 0.9);
            tooltip.html(countries[covidData.indexOf(i)] + `<br/> ${dataType}: ` + i)
            .style("left",  covidData.indexOf(i) * widthOfBar + 20 + "px")
            .style("top", height - 170 + "px");
            
        }

        )
        .on("mouseout", (d) => {
            tooltip.style("opacity", 0)
        })

        

        const svg = d3
        .select(".graph-container") // Select the graph container
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

        
        
        
    };

    return (

        <>
            <svg width={width} height={height}></svg>
        </>
    );
    
}

ReactDOM.render(<App/>, document.getElementById("root"));

