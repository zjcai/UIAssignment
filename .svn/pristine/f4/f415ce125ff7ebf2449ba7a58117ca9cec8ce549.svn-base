'use strict';

// Put your view code here (e.g., the graph renderering code)
/**
 *  InputView  
 */
var InputView = function(model) {
    // Obtains itself   
    var self = this;

    // Stores the model
    this.model = model;

    // Available tabs and divs
    this.activity= document.getElementById("activity");

    this.energyLevel = document.getElementById('energyLevel');
    this.stressLevel = document.getElementById('stressLevel');
    this.happinessLevel = document.getElementById('happinessLevel');
    this.timeSpent = document.getElementById('timeSpent');

    this.energyLevelErrorMessage = document.getElementById('energyLevelErrorMessage');
    this.stressLevelErrorMessage = document.getElementById('stressLevelErrorMessage');
    this.happinessLevelErrorMessage = document.getElementById('happinessLevelErrorMessage');
    this.timeSpentErrorMessage = document.getElementById('timeSpentErrorMessage');

    this.LastDateEntry = document.getElementById('LastDateEntry');
    this.submit_button = document.getElementById('submitBtn');

    this.monthDisplayNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    // bind input view with model
    this.submit_button.addEventListener('click', function() {
        var activityValue = self.activity.options[self.activity.selectedIndex].text;
        var energyLevelValue = self.energyLevel.value;
        var stressLevelValue = self.stressLevel.value;
        var happinessLevelValue = self.happinessLevel.value;
        var timeSpentValue = self.timeSpent.value;
        
        var valid = true;
        valid = validation(1, 5, energyLevelValue, self.energyLevelErrorMessage) && valid;
        valid = validation(1, 5, stressLevelValue, self.stressLevelErrorMessage) && valid;
        valid = validation(1, 5, happinessLevelValue, self.happinessLevelErrorMessage) && valid;
        valid = validation(0, -1, timeSpentValue, self.timeSpentErrorMessage) && valid;
        if (!valid) return;

        var activityDataPoint = new ActivityData(
            activityValue, 
            {
                energyLevel: energyLevelValue,
                stressLevel: stressLevelValue,
                happinessLevel: happinessLevelValue
            },
            timeSpentValue
        );
        model.addActivityDataPoint(activityDataPoint);  
    });

    function validation(min, max, value, element) {
        var valid = false;
        var errMsg;
        if (value == "") {
            errMsg = "Please fill this field."
        }
        else if (value % 1 === 0) {
            if (max < min) {
                if (value < min) {
                    errMsg = "The number you entered is out of range."
                }
            }
            else if ((value > max) || (value < min)) {
                errMsg = "The number you entered is out of range."
            }
        }
        else {
            errMsg = "Please enter an integer."
        }

        if (errMsg != null) {
            element.innerHTML = errMsg;
        }
        else {
            element.innerHTML = '';
            valid = true
        }
        return valid;
    }

    // Binds model change with view
    this.model.addListener(function(eventType, eventTime, eventData) {
        if (eventType === ACTIVITY_DATA_ADDED_EVENT) {
            var currentDate = new Date();
            var currentHours = currentDate.getHours();
            var AMPM = "AM";
            if (currentHours > 12) {
                AMPM = "PM";
                currentHours = currentHours - 12;
            }
            self.LastDateEntry.innerHTML = self.monthDisplayNames[currentDate.getMonth()] + " " + currentDate.getDate() + ", " + currentDate.getFullYear()
                                            + " " + currentHours + ":"  + currentDate.getMinutes() + " " + AMPM;

            self.energyLevel.value ='';
            self.stressLevel.value = '';
            self.happinessLevel.value = '';
            self.timeSpent.value = '';

            alert("Success!");
        }
        else if (eventType === ACTIVITY_DATA_REMOVED_EVENT) {
            alert("Deleted Success!");
        }
    });
}

var GraphView = function(gmodel, vmodel) {
    // Obtains itself   
    var self = this;

    // Stores the model
    this.gmodel = gmodel;
    this.vmodel = vmodel;

    var activityTotalTimeObj;
    var activityTotalDataDictObj;

    // Available tabs and divs
    this.graphList= document.getElementById("graphList");
    var availableGraphNames = gmodel.getAvailableGraphNames();
    for (var i = 0; i < availableGraphNames.length; i++) {
        var label = document.createElement("label");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "graphRadios";
        radio.value = availableGraphNames[i];
        if (i === 0) radio.checked = true;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(availableGraphNames[i]));
        this.graphList.appendChild(label);    
    }

    this.graphRadioList = document.getElementsByName("graphRadios");
    this.graphDisplay = document.getElementById("graphDisplay");

    this.tableSummary = document.getElementById("tableSummary");
    this.scatterplot = document.getElementById("scatterplot");

    this.customize = document.getElementById("customize");
    this.ELCheckbox = document.getElementById("ELCheckbox");
    this.SLCheckbox = document.getElementById("SLCheckbox");
    this.HLCheckbox = document.getElementById("HLCheckbox");
    this.plot = document.getElementById("plot");

    this.summaryTable = document.getElementById("summaryTable");
    
    // initialize page
    showGraph("tableSummary");

    // bind input view with model
    for(var i = 0; i < this.graphRadioList.length; i++) {
        self.graphRadioList[i].addEventListener('click', function() {
            var selectGraph;
            for(var index = 0; index < self.graphRadioList.length; index++){
                if(self.graphRadioList[index].checked){
                    selectGraph = self.graphRadioList[index].value;
                    if (gmodel.getNameOfCurrentlySelectedGraph() === selectGraph) return;
                    break;
                }
            }
            gmodel.selectGraph(selectGraph);  
        });
    }

    this.plot.addEventListener('click', function() {
        updateScatterplot();
    });

    // updates display when the current graph change
    this.gmodel.addListener(function(eventType, eventTime, eventData) {
        if (eventType === GRAPH_SELECTED_EVENT) {
            showGraph(eventData);
        }
    });

    this.vmodel.addListener(function(eventType, eventTime, eventData) {
        if (eventType === ACTIVITY_DATA_ADDED_EVENT) {
            if (!activityTotalTimeObj) {
                var result = buildSummaryTable();
                activityTotalTimeObj = result[0];
                activityTotalDataDictObj = result[1];
            }
            else {
                if (eventData.activityType in activityTotalTimeObj) {
                    activityTotalTimeObj[eventData.activityType] = parseInt(eventData.activityDurationInMinutes) + activityTotalTimeObj[eventData.activityType];
                }
                else {
                    activityTotalTimeObj[eventData.activityType] = parseInt(eventData.activityDurationInMinutes);
                    activityTotalDataDictObj[eventData.activityType] = [];
                }
                activityTotalDataDictObj[eventData.activityType].push(eventData.activityDataDict); 
            }

            updateTable();
            updateScatterplot();
        }
    });

    function showGraph(divName) {
        switch (divName) {
            case 'tableSummary':
                self.tableSummary.className = "";
                self.scatterplot.className = 'hidden';
                self.customize.className = 'hidden'
                break;
            case 'scatterplot':
                self.tableSummary.className = "hidden";
                self.scatterplot.className = '';
                self.customize.className = ''
                break;
        }
    }

    function buildSummaryTable() {
        var activityDataPoints = vmodel.getActivityDataPoints();
        var dict = {}; 
        var dict2 = {};
        for (var i = 0; i < activityDataPoints.length; i++) {
            var activityDataPoint = activityDataPoints[i];
            if (activityDataPoint in dict) {
                dict[activityDataPoint.activityType] = parseInt(activityDataPoint.activityDurationInMinutes) + dict[activityDataPoint.activityType];
            }
            else {
                dict[activityDataPoint.activityType] = parseInt(activityDataPoint.activityDurationInMinutes);
                dict2[activityDataPoint.activityType] = []; 
            }
            dict2[activityDataPoint.activityType].push(activityDataPoint.activityDataDict);  
        }
        return [dict, dict2];
    }

    function updateTable() {
        var old_tbody = self.summaryTable.getElementsByTagName('tbody')[0];
        var new_tbody = document.createElement('tbody');
        var row = 0;
        for (var key in activityTotalTimeObj) {
            var newRow = new_tbody.insertRow(row);
            var activityCell = newRow.insertCell(0).appendChild(document.createTextNode(key));
            var timeCell = newRow.insertCell(1).appendChild(document.createTextNode(activityTotalTimeObj[key] + " min"));
            row++;
        }
        self.summaryTable.replaceChild(new_tbody, old_tbody)
    }

    function updateScatterplot() {
        var c = document.getElementById("myScatterplot");
        var ctx = c.getContext("2d");
        ctx.clearRect(0 , 0 , c.width, c.height);
            
        var width = c.width;
        var height = c.height - 100;


        if (!activityTotalDataDictObj) {
            alert("No Data")
            return;
        }

        var plotEL = self.ELCheckbox.checked;
        var plotSL = self.SLCheckbox.checked;
        var plotHL = self.HLCheckbox.checked;

        if (!(plotEL || plotSL || plotHL)) {
            alert("Please select at least one element for scatterplot");
            return;
        }

        var n = Object.keys(activityTotalDataDictObj).length;
        var dx = Math.floor(width/(n+1));
        var dy = Math.floor(height/6);

        ctx.beginPath();
        ctx.rect(0,0,width,height);
        ctx.stroke();
        
        var element = 1;
        for (var key in activityTotalDataDictObj) {
            var dataDictList = activityTotalDataDictObj[key];
            ctx.rotate(Math.PI/2);
            ctx.font = "10px Arial";
            ctx.fillText(key,height+10,-(element*dx));
            ctx.rotate(-Math.PI/2);
            for (var i = 0; i < dataDictList.length; i++) {
                ctx.beginPath();
                if (plotEL) ctx.arc((element*dx),(height - dy*(dataDictList[i].energyLevel)),5,0,2*Math.PI);
                if (plotSL) ctx.rect(element*dx-2.5,(height - dy*(dataDictList[i].stressLevel))-2.5,5,5);
                if (plotHL) {
                    ctx.moveTo(element*dx-8,(height - dy*(dataDictList[i].happinessLevel)));
                    ctx.lineTo(element*dx+8,(height - dy*(dataDictList[i].happinessLevel)));
                }
                ctx.stroke();
            }
            element++;
        }
    }
}

/**
 *  TabView  
 */
var TabView = function(model) {
    // Obtains itself   
    var self = this;

    // Stores the model
    this.model = model;

    // Available tabs and divs
    this.nav_input_tab = document.getElementById('nav-input-tab');
    this.input_div = document.getElementById('input-div');

    this.nav_analysis_tab = document.getElementById('nav-analysis-tab');
    this.analysis_div = document.getElementById('analysis-div');

    // Binds tab view with model  
    this.nav_input_tab.addEventListener('click', function() {
        model.selectTab('InputTab');
    });

    this.nav_analysis_tab.addEventListener('click', function() {
        model.selectTab('AnalysisTab');
    });

    // Binds model change with view
    this.model.addListener(function(eventType, eventTime, eventData) {
        if (eventType === TAB_SELECTED_EVENT)   {
            switch (eventData) {
                case 'InputTab':
                    self.nav_input_tab.className = "active";
                    self.nav_analysis_tab.className = "";
                    self.input_div.className = '';
                    self.analysis_div.className = 'hidden';
                    break;
                case 'AnalysisTab':
                    self.nav_analysis_tab.className = "active";
                    self.nav_input_tab.className = "";
                    self.input_div.className = 'hidden';
                    self.analysis_div.className = '';
                    break;
            }
        }
    });
}