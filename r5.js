function createRandomData(num) {

    //shape attributes'boundaries
    const MAX_X = 6000;
    const MIN_X = 0;
    const MAX_Y = 4000;
    const MIN_Y = 0;
    const MAX_SIZE = 5000;
    const MIN_SIZE = 50;

    var data = [];
    data.push(COL_NAMES);//add columns at the top
    for (let i = 0; i < num; i++) {
        var shape = SHAPE_OPTIONS[parseInt(createRandomValue(0, SHAPE_OPTIONS.length))];
        var cx = createRandomValue(MIN_X, MAX_X);
        var cy = createRandomValue(MIN_Y, MAX_Y);
        var size = createRandomValue(MIN_SIZE, MAX_SIZE);
        data.push({shape, cx, cy, size});
    }//end for

    return data;
}

//returns a random value in the rage [min, max)
function createRandomValue(min, max) {
    return Math.random() * (max - min) + min;
}
//column names
const COL_NAMES = ["shape", "cx", "cy", "size"];
//shape options
const SHAPE_OPTIONS = ["circle", "square", "triangle"];

function createTestData(shape, num, baseSize, skip) {
    var data = [];
    data.push(COL_NAMES);//add columns at the top
    for (let i = 0; i < num; i++) {
        var cx = skip * (i + 1);
        var cy = skip * (i + 1);
        var size = baseSize * (i + 1);
        data.push({shape, cx, cy, size});
    }//end for

    //print out data for debugging
    console.log(data);

    return data;
}

$("body").ready(init);
var scaleX, scaleY, scaleSize;

function init() {

    var data = createRandomData(50);
    var circleData = data.filter(function (d) {    // (Create Circle Data)

        return d.shape === 'circle';
    });
    
    console.log(circleData);
    
    var squareData = data.filter(function (d) {    // (Create Square Data)

        return d.shape === 'square';
    });
    
    console.log(squareData);
    
    var triangleData = data.filter(function (d) {    // (Create triangle Data)

        return d.shape === 'triangle';
    });
    console.log(triangleData);

    var xMax = d3.max(data, (d) => {
        return d.cx;
    });
    var yMax = d3.max(data, (d) => {
        return d.cy;
    });
    var sizeMax = d3.max(data, (d) => {
        return d.size;
    });


    scaleX = d3.scaleLinear()//create a scale function
            .domain([0, xMax])//original data range
            .range([0, $(window).width()]);//new domain range

    scaleY = d3.scaleLinear()
            .domain([0, yMax])//original data range
            .range([0, $(window).height()]);//new domain range

    scaleSize = d3.scaleLinear()
            .domain([50, sizeMax])//original data range
            .range([5, 50]);//new domain range

    d3.select("#svg")
            .style("width", $(window).width())
            .style("height", $(window).height())
            .style("background-color", "#00bbf9");

//Create Circle
    
    d3.select("#svg")
            .selectAll("circle")
            .data(circleData)
            .enter()
            .append("circle")
            .style("opacity", 0.5)
            .attr("cx", (d, i) => {
                return scaleX(d.cx);
            })
            .attr("cy", (d) => {
                return scaleY(d.cy);
            })
            .attr("r", (d) => {
                return scaleSize(d.size);
            })
            .attr("fill", "#9b5de5")
            .attr("stroke", "black")
            .on("click", handleClickCircle)//adding an event listener
            .on("mouseover", handleClickCircle)//adding an event listener
            .on("mouseout", handleMouseout);//adding an event listener



//Create rectangle

    d3.select("#svg")
            .selectAll("rect")
            .data(squareData)
            .enter()
            .append("rect")
            .style("opacity", 0.5)
            .attr("x", (d, i) => {
                return scaleX(d.cx + d.cx);
            })
            .attr("y", (d) => {
                return scaleY(d.cy + d.cy);
            })
            .attr("width", (d) => {
                return scaleSize(d.size / 2);
            })
            .attr("height", (d) => {
                return scaleSize(d.size / 2);
            })
            .attr("fill", "#fee440")
            .attr("stroke", "black")
            .on("click", handleClickRect)//adding an event listener
            .on("mouseover", handleClickRect)//adding an event listener
            .on("mouseout", handleMouseout);//adding an event listener


//Create triangle

    d3.select("#svg")
            .selectAll("polygon")
            .data(triangleData)
            .enter()
            .append("polygon")
            .style("opacity", 0.5)
            .attr("points", function (d) {
                return [
                    scaleX(d.cx + 1000) - 0.5 * Math.sqrt(3) * scaleSize((getCircumradius(0.5 * d.size))), scaleY(d.cy) - 0.5 * scaleSize(getCircumradius(0.5 * d.size)),
                    scaleX(d.cx + 1000) + 0.5 * Math.sqrt(3) * (scaleSize(getCircumradius(0.5 * d.size))), scaleY(d.cy) - 0.5 * scaleSize(getCircumradius(0.5 * d.size)),
                    scaleX(d.cx + 1000), scaleY(d.cy) + scaleSize(getCircumradius(0.5 * d.size))].join(" ");
            }
            )
            .attr("fill", "#fb8500")
            .attr("stroke", "black")
            .on("click", handleClickTri)//adding an event listener
            .on("mouseover", handleClickTri)//adding an event listener
            .on("mouseout", handleMouseout);//adding an event listener

    var xAxis = d3.axisBottom()//create an axis
            .scale(scaleX);//specify the scale you want to use

    //add the axis to the svg
    d3.select("#svg")
            .append("g")
            .call(xAxis);

    var yAxis = d3.axisRight()//create an axis
            .scale(scaleY);//specify the scale you want to use

    //add the axis to the svg
    d3.select("#svg")
            .append("g")
            .call(yAxis);

}
//Add interaction for rectangle
function handleClickRect(event, d) {
    
    d3.select("#floater")
            .style("left", event.clientX + Number(10) + "px")
            .style("top", event.clientY + "px")
            .html("Shape: " + d.shape + "<br> CX: " + d.cx + "<br> CY: " + d.cy + "<br> Size: " + d.size)
            ;
            
    //bring all the rect' opacity back to 0.5
    d3.selectAll("rect")
            .style("opacity", 0.5)
            .attr("width", (d, i) => {
                return scaleSize(d.size/2);
            })
            .attr("height", (d, i) => {
                return scaleSize(d.size/2);
            });
     //Add interaction to rectangle
    d3.select(event.target)
//            .attr("cx",0)
            .style("opacity", 1)
            .attr("fill", "#fee440")
            .attr("height", (d, i) => {
                return scaleSize(d.size) * 2;
            })
            .attr("width", (d, i) => {
                return scaleSize(d.size) * 2;
            });
    $("#svg").append(event.target);
}
//Add interaction for triangle
function handleClickTri(event, d) {
    
    d3.select("#floater")
            .style("left", event.clientX + Number(10) + "px")
            .style("top", event.clientY + "px")
            .html("Shape: " + d.shape + "<br> CX: " + d.cx + "<br> CY: " + d.cy + "<br> Size: " + d.size)
            ;
    //bring all the triangle' opacity back to 0.5
    d3.selectAll("triangle")
            .style("opacity", 0.5)
            .attr("points", function (d) {
                return [
                    scaleX(d.cx + 1000) - 0.5 * Math.sqrt(3) * scaleSize((getCircumradius(0.5 * d.size))), scaleY(d.cy) - 0.5 * scaleSize(getCircumradius(0.5 * d.size)),
                    scaleX(d.cx + 1000) + 0.5 * Math.sqrt(3) * (scaleSize(getCircumradius(0.5 * d.size))), scaleY(d.cy) - 0.5 * scaleSize(getCircumradius(0.5 * d.size)),
                    scaleX(d.cx + 1000), scaleY(d.cy) + scaleSize(getCircumradius(0.5 * d.size))].join(" ");
            }
            );
    //Add interaction to triangle
    d3.select(event.target)
            .style("opacity", 1)
            .attr("fill", "#fb8500")
            .attr("points", function (d) {
                return [
                    scaleX(d.cx + 1000) - 0.5 * Math.sqrt(3) * scaleSize((getCircumradius(0.5 * (2 * d.size)))), scaleY(d.cy) - 0.5 * scaleSize(getCircumradius(0.5 * (2 * d.size))),
                    scaleX(d.cx + 1000) + 0.5 * Math.sqrt(3) * (scaleSize(getCircumradius(0.5 * (2 * d.size)))), scaleY(d.cy) - 0.5 * scaleSize(getCircumradius(0.5 * (2 * d.size))),
                    scaleX(d.cx + 1000), scaleY(d.cy) + scaleSize(getCircumradius(0.5 * (2 * d.size)))].join(" ");
            }
            );
}

//Add interaction for circle
function handleClickCircle(event, d) {
    //console.log(event.clientX);//mouse click location x
    console.log(event.target);//mouse click location x
 

    d3.select("#floater")
            .style("left", event.clientX + Number(10) + "px")
            .style("top", event.clientY + "px")
            .html("Shape: " + d.shape + "<br> CX: " + d.cx + "<br> CY: " + d.cy + "<br> Size: " + d.size)
            ;

    //bring all the circles' opacity back to 0.5
    d3.selectAll("circle")
            .style("opacity", 0.5)
            .attr("r", (d, i) => {
                return scaleSize(d.size);
            });


    d3.select(event.target)
            .style("opacity", 1)
            .attr("fill", "#9b5de5")
            .attr("r", (d, i) => {
                return scaleSize(d.size) * 2;
            });


    $("#svg").append(event.target);
}

function handleMouseout(event, d) {
    d3.select(event.target)
            .style("opacity", 0.5)
            .attr("r", (d, i) => {
                return scaleSize(d.size);
            })
            .attr("height", (d, i) => {
                return scaleSize(d.size);
            })
            .attr("width", (d, i) => {
                return scaleSize(d.size);
            });

    d3.select(event.target)
            .style("opacity", 0.5)
            .attr("points", function (d) {
                return [
                    scaleX(d.cx + 1000) - 0.5 * Math.sqrt(3) * scaleSize((getCircumradius(0.5 * d.size))), scaleY(d.cy) - 0.5 * scaleSize(getCircumradius(0.5 * d.size)),
                    scaleX(d.cx + 1000) + 0.5 * Math.sqrt(3) * (scaleSize(getCircumradius(0.5 * d.size))), scaleY(d.cy) - 0.5 * scaleSize(getCircumradius(0.5 * d.size)),
                    scaleX(d.cx + 1000), scaleY(d.cy) + scaleSize(getCircumradius(0.5 * d.size))].join(" ");
            }
            );
    //Change the color of the shapes back to default

    d3.selectAll("circle")
            .attr("fill", "#9b5de5");
    d3.selectAll("rect")
            .attr("fill", "#fee440");
    d3.selectAll("polygon")
            .attr("fill", "#fb8500");


    d3.select("#floater")
            .html("");

}
//Calculate the circumradius of each triangle
function getCircumradius(d)
{
    var r = d / Math.sqrt(3);
    return r;
}


