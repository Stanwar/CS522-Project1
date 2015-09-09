
function Class() { }

Class.prototype.construct = function() {};

Class.extend = function(def) {
    var classDef = function() {
        if (arguments[0] !== Class) { this.construct.apply(this, arguments); }
    };
 
    var proto = new this(Class);
    var superClass = this.prototype;
 
    for (var n in def) {
        var item = def[n];                      
        if (item instanceof Function) item.superClass = superClass;
        proto[n] = item;
    }
 
    classDef.prototype = proto;
 
    //Give this new class the same static extend method    
    classDef.extend = this.extend;      
    return classDef;
};

////////////////////////////////////////

// code adapted from http://bl.ocks.org/mbostock/3202354

var linemap_App = Class.extend({

construct: function() {

this.year = "2013";
this.room = +5;

this.room1 = "Ph.D. Room";
this.room2 = "Classroom";
this.room3 = "Thin Rooms";
this.room4 = "Work Room";
this.room5 = "Main Lab";
this.room6 = "Meeting Room";
this.room7 = "Machine Room";

this.margin = {top: 60, right: 30, bottom: 40, left: 60};
this.vizWidth = 0;
this.vizHeight = 0;

this.canvasWidth = 1400;
this.canvasHeight = 300;


this.svg = null;
this.myTag = "";

this.minTemp = 55;
this.maxTemp = 90;

this.line1;
this.line2;
this.line3;
this.line4;
this.line5;
this.line6;
this.line7;
},

/////////////////////////////////////////////////////////////

initApp: function()
{
  this.inDataCallbackFunc = this.inDataCallback.bind(this);
},

initAppWithRoomandYear: function(roomNumber, yearNumber)
{
  this.room = +roomNumber; // number
  this.year = yearNumber.toString(); // string
  this.inDataCallbackFunc = this.inDataCallback.bind(this);
},

////////////////////////////////////////

startup: function (whereToRender)
{
    this.myTag = whereToRender;
    this.svg = d3.select(this.myTag).append("svg");

    this.updateWindow();
    this.updateScreen();
},

/////////////////////////////////////////////////////////////

updateWindow: function ()
{
  var xWin, yWin;

  xWin = d3.select(this.myTag).style("width");
  yWin = d3.select(this.myTag).style("height");

  this.vizWidth = xWin;
  this.vizHeight = yWin;

  var totalSizeX = this.canvasWidth+this.margin.left+this.margin.right;
  var totalSizeY = this.canvasHeight+this.margin.top+this.margin.bottom;

  this.svg = d3.select(this.myTag).select("svg")
  .attr("width", this.vizWidth)
  .attr("height", this.vizHeight)
  .attr("viewBox", "" + -this.margin.left + " 0 " + totalSizeX + " " + this.canvasHeight);
},


/////////////////////////////////////////////////////////////

inDataCallback: function(error, tempData)
{
  var parseDate = d3.time.format("%m/%d/%Y").parse;
  var formatDate = d3.time.format("%b");

  var xStep = 864e5;

  var upperWidth = this.canvasWidth - 50; 
  var lowerWidth = 50;

  var upperHeight = this.canvasHeight - 50; 
  var lowerHeight = 50;

  x = d3.time.scale().range([+lowerWidth, +upperWidth]);
  y = d3.scale.linear().range([+lowerHeight, +upperHeight]);

  var x, y;

  var lineX;

  // clear out the canvas
  this.svg.selectAll("*").remove(); 


  this.line1 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.S1); });

  this.line2 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.S2); });

  this.line3 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.S3); });

  this.line4 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.S4); });

  this.line5 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.S5); });

  this.line6 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.S6); });

  this.line7 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.S7); });

  // get temperature data for that room
  tempData.forEach(function(d){
    d.Date = parseDate(d.Date);
    d.Hour = +d.Hour;
    d.S1 = +d.S1;
    d.S2 = +d.S2;
    d.S3 = +d.S3;
    d.S4 = +d.S4;
    d.S5 = +d.S5;
    d.S6 = +d.S6;
    d.S7 = +d.S7;
  });

  // set the room name for the header
  switch(this.room) {
    case 1:
         this.roomName = this.room1;
         lineX = this.line1; break;
    case 2:
         this.roomName = this.room2;
         lineX = this.line2; break;
    case 3:
         this.roomName = this.room3;
         lineX = this.line3; break;
    case 4:
         this.roomName = this.room4;
         lineX = this.line4; break;
    case 5:
         this.roomName = this.room5;
         lineX = this.line5; break;
    case 6:
         this.roomName = this.room6;
         lineX = this.line6; break;
    case 7:
         this.roomName = this.room7;
         lineX = this.line7; break;
    default:
         this.roomName = this.room5;
         lineX = this.line5; break;
    }

  x.domain(d3.extent(tempData, function(d) { return d.Date; }));
  x.domain([+x.domain()[0], +x.domain()[1] + xStep]);

  y.domain([this.maxTemp,this.minTemp]);
 
  // Add an x-axis with label.
 
  this.svg.append("g")
      .attr("class", "x axis")
      .attr("stroke-width", 2)
      .attr("transform", "translate(-" + lowerWidth + " ," +upperHeight + ")")
      .call(d3.svg.axis()
          .scale(x)
          .ticks(d3.time.months)
          .tickSize(-upperHeight+lowerHeight)
          .tickFormat(formatDate)
          .orient("bottom"))
      .selectAll("text")
        .attr("y", 7)
        .attr("x", 5)
        .style("font-size", 18)
        .style("text-anchor", "start");


  // Add a y-axis with label.

  this.svg.append("g")
      .attr("class", "y axis")
      .attr("stroke-width", 2)
      .style("font-size",18)
      .call(d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(-upperWidth+lowerWidth));

  // big text up top
  this.svg.append("text")
    .attr("x", upperWidth / 2)
    .attr("y", lowerHeight-10)
    .attr("font-size", 40)
    .style("font-weight", "plain") .style("text-anchor", "middle")
    .style("font-family", "sans-serif") .text(this.year+" - "+this.roomName);

  // draw the line
  this.svg.append("path") .datum(tempData)
      .attr("class", "line") 
      .attr("transform", "translate(-" + lowerWidth + ",0)")
      .style("stroke", "rgb(200,100,100)") 
      .style("stroke-width", 4)
      .attr("d", lineX);
},

/////////////////////////////////////////////////////////////

updateData: function (roomNum)
{
  this.room = +roomNum; 

  var fileToLoad = "noon_"+this.year+".tsv";

  d3.tsv(fileToLoad, this.inDataCallbackFunc);
},

/////////////////////////////////////////////////////////////

setYear: function (newYear)
{
  this.year = newYear;
  this.updateData(this.room);
},

/////////////////////////////////////////////////////////////


updateScreen: function ()
{
  this.updateWindow();
  this.updateData(this.room);
},

});