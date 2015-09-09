var usApp = Class.extend({
		/////
		//
		/////
	construct: function () {
        //
        // Initializing local variables
        //
        this.olderIcon = null;
        this.newerIcon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.marPolyLat = null;
        this.marPolyLng = null;
        this.marArray = [];
        this.myTag = null;

    },

    startup: function(whereToRender) {
		this.myTag = whereToRender;
		this.svg = d3.select(this.myTag).append("svg");

		this.updateWindow();
		this.updateScreen();
    },

    update: function (){

    },
    updateWindow: function (){
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
    updateScreen: function (){

    },
    
    /////
    //
    /////
    makeCallback: function(){
		var width = 960,
		    height = 500;

		var projection = d3.geo.albersUsa()
		    .scale(1000)
		    .translate([width / 2, height / 2]);

		var path = d3.geo.path()
		    .projection(projection);

		var svg = d3.select("#map").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		d3.json("data/topo_us.json", function(error, us) {
		  if (error) throw error;

		  svg.insert("path", ".graticule")
		      .datum(topojson.feature(us, us.objects.land))
		      .attr("class", "land")
		      .attr("d", path);
/*
		  svg.insert("path", ".graticule")
		      .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
		      .attr("class", "county-boundary")
		      .attr("d", path);
		      */

		  svg.insert("path", ".graticule")
		      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
		      .attr("class", "state-boundary")
		      .attr("d", path);
		});
	},
    /////
    //
    /////
    init: function(){
    	this.makeCallbackFunc = this.makeCallback.bind(this);

    }
});