$(document).ready(function(){
    setup_computer_availability();
    
    try {
        window.parent.postMessage("loaded", "*"); // Cross Domain Success Message
    } catch(e) {}
    
    // MODES
    if(document.location.href.indexOf('mode=kiosk') != -1) {
        jQuery('body').addClass('kiosk-mode');
    }
});	

var setup_computer_availability = function() {
        
    //check if library is open
    // $.getJSON( "http://www.uwosh.edu/library/ws/getLibraryHours?v=2&alt=jsonp&callback=?", function(data) {
        // if(data.currently_is_open == 0)
        // {
            // $("#browser_message")
                // .css({ fontSize: '23px', fontWeight: 'bold', color: 'red', margin: '20px', padding: '10px', backgroundColor: '#CCCCCC', border: '1px solid black', borderRadius: '5px', width: '840px' })
                // .html("The library is currently closed. It will open again ");
            // for(day in data.times)
            // {
                // if(data.times[day].is_open == 1)
                // {
                    // $("#browser_message").append(data.times[day].open + ".");
                    // break;
                // }
            // }
            // return false;
        // }
    // });
    
    //variable declarations
    
    //ratios for green / red overlays
    //if the available number of computers divided by the total number of computers is less than the ratio, then the overlay is red, otherwise it is green
    var polk101_ratio = .1;
    var emc_ratio = .25;
    var lab_ratio = .1;
    var floor_two_north_ratio = .5;
    var floor_two_south_ratio = .5;
    var floor_three_north_ratio = .5;
    var floor_three_south_ratio = .25;
    
    //time interval to retrieve the status of computers (in seconds)
    var time_interval = 60;
    
	//variable to block clicks
	var isClickable = true;
	
    //image sources
    var doorway = new Image();
    doorway.src = "++resource++polklibrary.webservices/doorway.png";
    var available = new Image();
    available.src = "++resource++polklibrary.webservices/available.png";
    var bathroom_female = new Image();
    bathroom_female.src = "++resource++polklibrary.webservices/bathroom_female_large.png";
    var bathroom_male = new Image();
    bathroom_male.src = "++resource++polklibrary.webservices/bathroom_male_large.png";
    var column = new Image();
    column.src = "++resource++polklibrary.webservices/column.png";
    var detailed_arrow = new Image();
    detailed_arrow.src = "++resource++polklibrary.webservices/detailed_arrow.png";
    var doorway = new Image();
    doorway.src = "++resource++polklibrary.webservices/doorway.png";
    var emc_table = new Image();
    emc_table.src = "++resource++polklibrary.webservices/emc_table.png";
    var exit = new Image();
    exit.src = "++resource++polklibrary.webservices/exit.png";
    var large_desk = new Image();
    large_desk.src = "++resource++polklibrary.webservices/large_desk.png";
    var large_desk2 = new Image();
    large_desk2.src = "++resource++polklibrary.webservices/large_desk2.png";
    var main_desk = new Image();
    main_desk.src = "++resource++polklibrary.webservices/main_desk.png";
    var printer_desk = new Image();
    printer_desk.src = "++resource++polklibrary.webservices/printer_desk.png";
    var small_desk = new Image();
    small_desk.src = "++resource++polklibrary.webservices/small_desk.png";
    var stairs = new Image();
    stairs.src = "++resource++polklibrary.webservices/stairs.png";
    var studyroom_available = new Image();
    studyroom_available.src = "++resource++polklibrary.webservices/studyroom_available.png";
    var studyroom_unavailable = new Image();
    studyroom_unavailable.src = "++resource++polklibrary.webservices/studyroom_unavailable.png";
    var trapezoid_table = new Image();
    trapezoid_table.src = "++resource++polklibrary.webservices/trapezoid_table.png";
    var unavailable = new Image();
    unavailable.src = "++resource++polklibrary.webservices/unavailable.png";
    
    //set up canvases and floors
    var polk101 = document.getElementById('polk101');
    var emc = document.getElementById('emc');
    var floor_two_south = document.getElementById('floor_two_south');
    var floor_two_north = document.getElementById('floor_two_north');
    var floor_three_south = document.getElementById('floor_three_south');
    var floor_three_north = document.getElementById('floor_three_north');
    var floor_one_walkway = document.getElementById('floor_one_walkway');
    var floor_two_walkway = document.getElementById('floor_two_walkway');
    var floor_three_walkway = document.getElementById('floor_three_walkway');
    var context = polk101.getContext('2d');

    // FLOOR ONE
    polk101.style.height = 300;
    polk101.style.width = 300;
    polk101.height = 840;
    polk101.width = 840;
    emc.style.height = 420;
    emc.style.width = 420;
    emc.height = 840;
    emc.width = 840;
    emc_walkway.style.height = 95;
    emc_walkway.style.width = 42;
    emc_walkway.height = 267;
    emc_walkway.width = 118;
    polk101_walkway.style.height = 95;
    polk101_walkway.style.width = 42;
    polk101_walkway.height = 267;
    polk101_walkway.width = 118;

    // FLOOR TWO
    floor_two_south.style.height = 342;
    floor_two_south.style.width = 300;
    floor_two_south.height = 958;
    floor_two_south.width = 840;
    floor_two_north.style.height = 342;
    floor_two_north.style.width = 300;
    floor_two_north.height = 958;
    floor_two_north.width = 840;
    floor_two_north_walkway.style.height = 95;
    floor_two_north_walkway.style.width = 42;
    floor_two_north_walkway.height = 267
    floor_two_north_walkway.width = 118;
    floor_two_south_walkway.style.height = 95;
    floor_two_south_walkway.style.width = 42;
    floor_two_south_walkway.height = 267;
    floor_two_south_walkway.width = 118;
    
    // FLOOR THREE
    floor_three_south.style.height = 342;
    floor_three_south.style.width = 300;
    floor_three_south.height = 958;
    floor_three_south.width = 840;
    floor_three_north.style.height = 342;
    floor_three_north.style.width = 300;
    floor_three_north.height = 958;
    floor_three_north.width = 840;
    floor_three_north_walkway.style.height = 95;
    floor_three_north_walkway.style.width = 42;
    floor_three_north_walkway.height = 267;
    floor_three_north_walkway.width = 118;
    floor_three_south_walkway.style.height = 95;
    floor_three_south_walkway.style.width = 42;
    floor_three_south_walkway.height = 267;
    floor_three_south_walkway.width = 118;

    //set measurements for distance units on canvas
    distanceUnit = polk101.height / 7;
    distanceUnitTwo = distanceUnit * 1.25;
    columnDimension = distanceUnit / 6;

    //variables for whether a not a floor is zoomed in
    var focusPolk101 = false;
    var focusEMC = false;
    var focusFloorTwoNorth = false;
    var focusFloorTwoSouth = false;
    var focusFloorThreeNorth = false;
    var focusFloorThreeSouth = false;
    
    //toggleable options
    var showStudyRooms = false;
    var showPCs = true;
    var showMacs = true;
    var popup_is_visible = false;
    var disable_detailed_arrow = false;
    
    //computer info
    var polk101_computers;
    var floor_two_north_computers;
    var floor_three_south_computers;
    var floor_three_north_computers;
    var emc_computers;
    var laptops;
    var scientific_calcs;
    var graphing_calcs;
    
    //groupfinder location -- create a group
    var groupfinder_location = 'http://www.uwosh.edu/library/groupfinder/create';
    
    //study rooms
    var floor_two_north_studyroom;
    var floor_two_south_studyroom;
    var floor_three_north_studyroom;

    //computer locations
    var polk101_computer_locations = [
        {"name": "REF01", "x":125, "y":370}, {"name": "REF10", "x":150, "y":265}, {"name": "REF08", "x":95, "y":255}, {"name": "REF09", "x":125, "y":255},
        {"name": "REF07", "x":70, "y":265}, {"name": "REF13", "x":110, "y":165}, {"name": "REF26", "x":370, "y":295}, {"name": "REF37", "x":230, "y":622},
        {"name": "REF18", "x":125, "y":135}, {"name": "REF34", "x":230, "y":345}, {"name": "REF15", "x":55, "y":175}, {"name": "REF20", "x":250, "y":130},
        {"name": "REF19", "x":95, "y":135}, {"name": "REF14", "x":85, "y":180}, {"name": "REF04", "x":135, "y":300}, {"name": "REF05", "x":110, "y":285},
        {"name": "REF36", "x":208, "y":600}, {"name": "REF29", "x":410, "y":315}, {"name": "REF22", "x":210, "y":250}, {"name": "REF02", "x":95, "y":370},
        {"name": "REF35", "x":110, "y":345}, {"name": "REF32", "x":250, "y":370}, {"name": "REF33", "x":230, "y":400}, {"name": "REF31", "x":330, "y":315},
        {"name": "REF24", "x":312, "y":283}, {"name": "REF28", "x":428, "y":283}, {"name": "REF30", "x":385, "y":325}, {"name": "REF27", "x":395, "y":280},
        {"name": "REF06", "x":55, "y":295}, {"name": "REF12", "x":135, "y":180}, {"name": "REF03", "x":160, "y":295}, {"name": "REF16", "x":70, "y":145},
        {"name": "REF11", "x":160, "y":175}, {"name": "REF17", "x":210, "y":130}, {"name": "REF21", "x":250, "y":250}, {"name": "REF23", "x":230, "y":280},
        {"name": "REF25", "x":345, "y":280}
    ];
    
    var polk101_mac_locations = [
        {"name": "REF38", "x":355, "y":325}, {"name": "REF42", "x":150, "y":145}, {"name": "REF40", "x":110, "y":400}, {"name": "REF39", "x":210, "y":370},
        {"name": "REF41", "x":85, "y":295}, {"name": "REF43", "x":230, "y":160}
    ];
    
    var polk101_printer_locations = [
        {"x":distanceUnit * 1.8, "y":distanceUnit * 4.0}, {"x":distanceUnit * 1.8, "y":distanceUnit * 4.3}, 
        {"x":distanceUnit * 1.95, "y":distanceUnit * 4.65}, {"x":distanceUnit * 2.2, "y":distanceUnit * 4.65}
    ];
        
    var polk101_scanner_location = [
        {"x":60, "y":140}
    ];
    
    var emc_computer_locations = [
        {"name": "EMC09", "x":305, "y":217}, {"name": "EMC08", "x":305, "y":287}, {"name": "EMC06", "x":335, "y":217}
    ];
    
    var emc_mac_locations = [
        {"name": "EMC07", "x":335, "y":287}
    ];
    
    var emc_printer_location = [
        {"x":385, "y":280}
    ];
    
    var lab_computer_locations = [
        {"name": "POLK04", "x":187, "y":767}, {"name": "POLK03", "x":208, "y":767}, {"name": "POLK02", "x":229, "y":767}, {"name": "POLK05", "x":166, "y":767}, 
        {"name": "POLK06", "x":145, "y":767}, {"name": "POLK07", "x":124, "y":767}, {"name": "POLK09", "x":82, "y":767}, {"name": "POLK10", "x":61, "y":767}, 
        {"name": "POLK11", "x":40, "y":767}, {"name": "POLK12", "x":40, "y":745}, {"name": "POLK08", "x":103, "y":767}, {"name": "POLK13", "x":61, "y":745}, 
        {"name": "POLK14", "x":103, "y":745}, {"name": "POLK15", "x":124, "y":745}, {"name": "POLK16", "x":145, "y":745}, {"name": "POLK17", "x":166, "y":745}, 
        {"name": "POLK18", "x":187, "y":745}, {"name": "POLK19", "x":208, "y":745}, {"name": "POLK20", "x":229, "y":745}, {"name": "POLK21", "x":229, "y":692}, 
        {"name": "POLK22", "x":145, "y":692}, {"name": "POLK23", "x":124, "y":692}, {"name": "POLK24", "x":103, "y":692}, {"name": "POLK25", "x":82, "y":692}, 
        {"name": "POLK26", "x":61, "y":692}, {"name": "POLK27", "x":40, "y":692}, {"name": "POLK28", "x":2, "y":692}, {"name": "POLK29", "x":2, "y":714}, 
        {"name": "POLK30", "x":2, "y":735}, {"name": "POLK31", "x":2, "y":756}, {"name": "POLK32", "x":2, "y":777}, {"name": "POLK33", "x":2, "y":798}, 
        {"name": "POLK34", "x":2, "y":819}
    ];
    
    var lab_mac_locations = [
        {"name": "PIMAC02", "x":166, "y":692}, {"name": "PIMAC03", "x":187, "y":692}, {"name": "PIMAC01", "x":208, "y":692}
    ];
    
    var floor_two_north_computer_locations = [
        {"name": "CATALOG13", "x":555, "y":445}, {"name": "CATALOG16", "x":605, "y":445}
    ];
    
    var floor_two_north_studyroom_location = [
        {"x":distanceUnitTwo * 3.4, "y":distanceUnit + distanceUnitTwo}
    ];
    
    var floor_two_south_computer_locations = [
        {"name": "CATALOG18", "x":35, "y":550}, {"name": "CATALOG17", "x":10, "y":550}
    ];
    
    var floor_two_south_studyroom_location = [
        {"x":0, "y":distanceUnit * 4.0}
    ];
    
    var floor_three_north_computer_locations = [
        {"name": "CATALOG20", "x":492, "y":500}, {"name": "CATALOG19", "x":492, "y":565}
    ];
    
    var floor_three_north_studyroom_location = [
        {"x":floor_three_north.width - (distanceUnitTwo + 4), "y":floor_three_north.height - distanceUnitTwo * 1.8}
    ];
    
    var floor_three_south_computer_locations = [
        {"name": "GOVDOC05", "x":125, "y":540}, {"name": "GOVDOC06", "x":125, "y":575}, 
        {"name": "GOVDOC07", "x":195, "y":575}, {"name": "GOVDOC08", "x":195, "y":540}
    ];
    
    var floor_three_south_printer_location = [
        {"x":170, "y":650}
    ];
    
    function update(){
		
        $.getJSON( "http://www.uwosh.edu/library/ws/getAvailableResources?v=2&alt=jsonp&callback=?", function(data) {
            
            //computers and circulation items
            try{ emc_computers = data.locations[0]; } catch(e){ } 
            try{ emc_macs = data.locations[1]; } catch(e){ } 
            try{ lab_computers = data.locations[2]; } catch(e){ } 
            try{ lab_macs = data.locations[3]; } catch(e){ } 
            try{ polk101_computers = data.locations[4]; } catch(e){ } 
            try{ polk101_macs = data.locations[5]; } catch(e){ } 
            try{ floor_two_north_computers = data.locations[6]; } catch(e){ } 
            try{ floor_two_south_computers = data.locations[7]; } catch(e){ } 
            try{ floor_three_north_computers = data.locations[8]; } catch(e){ } 
            try{ floor_three_south_computers = data.locations[9]; } catch(e){ } 
            
            

            //floor_two_north_computers = data.locations[1];
            //floor_three_south_computers = data.locations[2];
            //floor_three_north_computers = data.locations[3];
            //emc_computers = data.locations[4];
            //lab_computers = data.locations[5];
            //floor_two_south_computers = data.locations[6];
            //emc_macs = data.locations[8];
            //lab_macs = data.locations[9];
            //laptops = data.locations[10];
            //scientific_calcs = data.locations[11];
            //graphing_calcs = data.locations[12];
            
            //study rooms
            for(room in data.study_areas){
                if(data.study_areas[room].id == '46d173a11bd2c1d4bb1b132430894dd9')			//small room
                    floor_two_south_studyroom = data.study_areas[room];
                if(data.study_areas[room].id == '9b5909a00fc1d789fa28cbb9c1c7b15e')			//large room
                    floor_two_north_studyroom = data.study_areas[room];
                if(data.study_areas[room].id == 'b4246500454c9aff29058e4dad144241')			//3rd floor room
                    floor_three_north_studyroom = data.study_areas[room];
            }
            toggleValues();
            setInterval(toggleValues, 500);
        });
    }

    /***************************
    *												*
    *				POLK 101					*
    *												*
    ***************************/

    function toggleValuesInPolk101()
    {
        //clear canvas before drawing
        context = polk101.getContext('2d');
        context.clearRect(0, 0, polk101.width, polk101.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, polk101.width, polk101.height);

        if(polk101.getContext){		
            //faculty room
            context.fillStyle = "#CCCCCC";
            context.fillRect(distanceUnit * 4, 0, polk101.width, polk101.height);
            context.beginPath();
            context.strokeStyle = "#000000";
            context.moveTo(distanceUnit * 4, 0);
            context.lineTo(distanceUnit * 4, polk101.height);
            
            //doorway to walkway			
            context.drawImage(doorway, -30, 572);
            
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(1, 0);
            context.lineTo(1, 572);
            context.moveTo(1, 632);
            context.lineTo(1, polk101.height);
            context.stroke();
                
            if(focusPolk101){			
                //place main desk
                context.drawImage(main_desk, 110, 430);
                
                //place printing tables	
                context.drawImage(printer_desk, 230, 440);					
                
                //place computer tables
                
                //large computer tables
                context.drawImage(large_desk, 40, 130);
                context.drawImage(large_desk, 40, 250);
                context.drawImage(large_desk2, 300, 270);
                                
                //small computer tables
                context.drawImage(small_desk, 210, 130);
                context.drawImage(small_desk, 210, 250);
                context.drawImage(small_desk, 210, 370);
                context.drawImage(small_desk, 90, 370);
                
                //column piece by standing computers
                context.drawImage(column, 230, 600);

                //display printers
                context.fillStyle = "#0000FF";
                context.font = 'bold 47px sans-serif';
                context.textAlign = 'center';
                for(printer in polk101_printer_locations)
                    context.fillText("P", polk101_printer_locations[printer].x, polk101_printer_locations[printer].y);

                if(showPCs){
                    //set images to computer locations
                    for(computer in polk101_computer_locations)
                    {
                        if(polk101_computers.resources[computer].status == 0)
                            context.drawImage(unavailable, polk101_computer_locations[computer].x, polk101_computer_locations[computer].y);
                        else
                            context.drawImage(available, polk101_computer_locations[computer].x, polk101_computer_locations[computer].y);
                    }
                }
                
                if(showMacs){					
                    //set images to mac locations
                    for(mac in polk101_mac_locations)
                    {
                        if(polk101_macs.resources[mac].status == 0)
                            context.drawImage(unavailable, polk101_mac_locations[mac].x, polk101_mac_locations[mac].y);
                        else
                            context.drawImage(available, polk101_mac_locations[mac].x, polk101_mac_locations[mac].y);
                    }
                }	
            }
            
            /********************
            *			OVERLAYS			*
            ********************/

                /*
                //place columns
                context.fillStyle = "#CCCCCC";
                for(var i = 1; i <= 3; i++)
                {
                    for(var j = 1; j <= 6; j++)
                    {
                        context.fillRect((i * distanceUnit) - (columnDimension / 2), (j * distanceUnit) - (columnDimension / 2), columnDimension, columnDimension);
                    }
                }
                */
            
            if(!focusPolk101){
                if( ((polk101_computers.available + polk101_macs.available) / (polk101_computers.total + polk101_macs.total)) <= polk101_ratio)
                    context.fillStyle = "rgba(155, 0, 0, 0.6)";
                else
                    context.fillStyle = "rgba(0, 155, 0, 0.6)";
                    
                context.fillRect(2, 0, distanceUnit * 4 - 2, distanceUnit * 4.5);
            
                //display number of computers available on top
                context.fillStyle = "#000000";
                context.strokeStyle = "#FFFFFF";
                context.font = 'bold 150px sans-serif';
                context.textAlign = 'center';
                context.lineWidth = 3;
                //the + xx at the end is 1/4 of the size of the font (100px by default)
                //this is done to all numbers that appear in the overlay
                context.fillText( (polk101_computers.available + polk101_macs.available), distanceUnit * 4 / 2, distanceUnit * 5 / 2 + 50);
                context.strokeText( (polk101_computers.available + polk101_macs.available), distanceUnit * 4 / 2, distanceUnit * 5 / 2 + 50);
            }
        }
    }

    /********************
    *									*
    *				EMC				*
    *									*
    ********************/

    function toggleValuesInEMC()
    {
        //clear canvas before drawing
        context = emc.getContext('2d');
        context.clearRect(0, 0, emc.width, emc.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, emc.width, emc.height);
        
        if(emc.getContext){
        
            /*********************
            *			LANDMARKS		 *
            *********************/
                                
            //west offices
            context.fillStyle = "#CCCCCC";
            context.strokeStyle = "#000000";
            context.fillRect(distanceUnit * 2.5, emc.height - distanceUnitTwo, distanceUnit * 3, distanceUnitTwo);
            context.rect(distanceUnit * 2.5, emc.height - distanceUnitTwo, distanceUnit * 3, distanceUnitTwo);
            context.stroke();
            
            //north rooms
            //context.fillStyle = "#CCCCCC";
            context.fillRect(0, emc.height - distanceUnitTwo - distanceUnit * 2.5, distanceUnit * 1.5, distanceUnit * 2);
            
            //bathrooms
            //context.fillStyle = "#CCCCCC";
            context.fillRect(distanceUnit * 3, emc.height - distanceUnitTwo - distanceUnit * 1.5, distanceUnit * 2, distanceUnit);
            
            //circulation
            context.fillRect(emc.width - distanceUnitTwo * 1.2, 0, distanceUnitTwo * 1.2, distanceUnit * 4.5);
            
            //stairs
            context.fillStyle = "#CCCCCC";
            context.fillRect(distanceUnit * 4, emc.height - distanceUnitTwo * 3.6, distanceUnit, distanceUnit);
            context.drawImage(stairs, distanceUnit * 4.1, emc.height - distanceUnitTwo * 3.5);
            
            //lab
            context.strokeStyle = "#000000";
            context.rect(0, emc.height - distanceUnitTwo, distanceUnit * 2.5, distanceUnitTwo);
            context.stroke();
            
            //doorway to walkway			
            context.drawImage(doorway, emc.width - 30, 572);
            
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(emc.width - 1, 0);
            context.lineTo(emc.width - 1, 572);
            context.moveTo(emc.width - 1, 632);
            context.lineTo(emc.width - 1, emc.height);
            context.stroke();
            
            /********************
            *			COMPUTERS		*
            ********************/
            
            if(focusEMC){			
                //bathrooms
                context.drawImage(bathroom_male, distanceUnit * 3.4, distanceUnit * 4.6);
                context.drawImage(bathroom_female, distanceUnit * 4.4, distanceUnit * 4.6);
                
                //computer desk in EMC
                context.drawImage(emc_table, distanceUnit * 2.5, distanceUnit * 2);
                
                //computers at the desk in EMC
                if(showPCs){					
                    //set images to computer locations
                    for(computer in emc_computer_locations){
                        if(emc_computers.resources[computer].status == 0)
                            context.drawImage(unavailable, emc_computer_locations[computer].x, emc_computer_locations[computer].y);
                        else
                            context.drawImage(available, emc_computer_locations[computer].x, emc_computer_locations[computer].y);
                    }
                    
                    //set images to computer locations
                    for(computer in lab_computer_locations){
                        if(lab_computers.resources[computer].status == 0)
                            context.drawImage(unavailable, lab_computer_locations[computer].x, lab_computer_locations[computer].y);
                        else
                            context.drawImage(available, lab_computer_locations[computer].x, lab_computer_locations[computer].y);
                    }
                }
                
                if(showMacs){					
                    //set images to mac locations
                    for(mac in emc_mac_locations){
                        if(emc_macs.resources[mac].status == 0)
                            context.drawImage(unavailable, emc_mac_locations[mac].x, emc_mac_locations[mac].y);
                        else
                            context.drawImage(available, emc_mac_locations[mac].x, emc_mac_locations[mac].y);
                    }
                    
                    //set images to mac locations
                    for(mac in lab_mac_locations){
                        if(lab_macs.resources[mac].status == 0)
                            context.drawImage(unavailable, lab_mac_locations[mac].x, lab_mac_locations[mac].y);
                        else
                            context.drawImage(available, lab_mac_locations[mac].x, lab_mac_locations[mac].y);
                    }
                }
                
                //column
                //82, 745
                context.drawImage(column, 82, 745);
                
                //display printer
                context.fillStyle = "#0000FF";
                context.font = 'bold 50px sans-serif';
                context.textAlign = 'center';
                context.fillText("P", emc_printer_location[0].x, emc_printer_location[0].y);
                
                //laptops
                // context.fillStyle = "#000000";
                // context.strokeStyle = "#FFFFFF";
                // context.font = 'bold 60px sans-serif';
                // context.textAlign = 'center';
                // context.lineWidth = 3;
                // context.fillText(laptops.available, (emc.width - distanceUnitTwo * 1.2 + emc.width) / 2, (distanceUnit * 3 + distanceUnit * 4.5) / 2 + 15);
                // context.font = 'bold 20px sans-serif';
                // context.fillText("Laptops Available", (emc.width - distanceUnitTwo * 1.2 + emc.width) / 2, (distanceUnit * 3 + distanceUnit * 4.5) / 2 + 35);
                // context.fillText("at Circulation", (emc.width - distanceUnitTwo * 1.2 + emc.width) / 2, (distanceUnit * 3 + distanceUnit * 4.5) / 2 + 55);
            }
            
            /********************
            *			OVERLAYS			*
            ********************/
            
            if(!focusEMC){		
                //lab overlay
                if((lab_computers.available / lab_computers.total) <= lab_ratio)
                    context.fillStyle = "rgba(155, 0, 0, 0.6)";
                else
                    context.fillStyle = "rgba(0, 155, 0, 0.6)";
                
                context.fillRect(0, emc.height - distanceUnitTwo, distanceUnit * 2.5, distanceUnitTwo);
                
                //display number of computers available on top
                context.fillStyle = "#000000";
                context.strokeStyle = "#FFFFFF";
                context.font = 'bold 140px sans-serif';
                context.textAlign = 'center';
                context.lineWidth = 3;
                //the + xx at the end is 1/4 of the size of the font used above (100px by default)
                //this is done to all numbers that appear in the overlay
                context.fillText(lab_computers.available + lab_macs.available, distanceUnit * 2.5 / 2, (emc.height + emc.height - distanceUnitTwo) / 2 + 50);
                context.strokeText(lab_computers.available + lab_macs.available, distanceUnit * 2.5 / 2, (emc.height + emc.height - distanceUnitTwo) / 2 + 50);
                
                //emc overlay
                if((emc_computers.available + emc_macs.available) / (emc_computers.total + emc_macs.total) <= emc_ratio)
                    context.fillStyle = "rgba(155, 0, 0, 0.6)";
                else
                    context.fillStyle = "rgba(0, 155, 0, 0.6)";
                
                context.fillRect(distanceUnit * 2, distanceUnit * 1.5, distanceUnit * 1.5, distanceUnit * 1.5);
                
                //display number of computers available
                context.fillStyle = "#000000";
                context.strokeStyle = "#FFFFFF";
                context.font = 'bold 150px sans-serif';
                context.textAlign = 'center';
                context.lineWidth = 3;
                //the + xx at the end is 1/4 of the size of the font
                //this is done to all numbers that appear in the overlay
                context.fillText((emc_computers.available + emc_macs.available), distanceUnit * 2.75, distanceUnit * 2.25 + 50);
                context.strokeText((emc_computers.available + emc_macs.available), distanceUnit * 2.75, distanceUnit * 2.25 + 50);
                
                //circulation desk, laptops
                // context.fillStyle = "rgba(0, 155, 0, 0.6)";
                // context.fillRect(emc.width - distanceUnitTwo * 1.2, distanceUnit * 3, distanceUnitTwo * 1.2, distanceUnit * 1.5);
                
                // context.fillStyle = "#000000";
                // context.strokeStyle = "#FFFFFF";
                // context.font = 'bold 120px sans-serif';
                // context.textAlign = 'center';
                // context.lineWidth = 3;
                // context.fillText(laptops.available, (emc.width - distanceUnitTwo * 1.2 + emc.width) / 2, (distanceUnit * 3 + distanceUnit * 4.5) / 2 + 25);
                // context.strokeText(laptops.available, (emc.width - distanceUnitTwo * 1.2 + emc.width) / 2, (distanceUnit * 3 + distanceUnit * 4.5) / 2 + 25);
                // context.font = 'bold 45px sans-serif';
                // context.fillText("Laptops", (emc.width - distanceUnitTwo * 1.2 + emc.width) / 2, (distanceUnit * 3 + distanceUnit * 4.5) / 2 + 65);
            }
        }
    }

    /***************************
    *												*
    *				EMC WALKWAY			*
    *												*
    ***************************/
    
    function toggleValuesInEMCWalkway()
    {
        //clear canvas before drawing
        context = emc_walkway.getContext('2d');
        context.clearRect(0, 0, emc_walkway.width, emc_walkway.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, emc_walkway.width, emc_walkway.height);
        
        if(emc_walkway.getContext){					
            //exit
            context.drawImage(exit, emc_walkway.width - exit.width, emc_walkway.height - exit.height);
            
            //stairs
            context.drawImage(stairs, 5, 150);
            
            //draw in left border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(1, 0);
            context.lineTo(1, 60);
            context.moveTo(1, 120);
            context.lineTo(1, emc_walkway.height);
            context.stroke();
            
            //doorway to emc			
            context.drawImage(doorway, -30, 60);			
        }
    }
    
    /***************************
    *												*
    *			POLK 101 WALKWAY			*
    *												*
    ***************************/
    
    function toggleValuesInPolk101Walkway()
    {
        //clear canvas before drawing
        context = polk101_walkway.getContext('2d');
        context.clearRect(0, 0, polk101_walkway.width, polk101_walkway.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, polk101_walkway.width, polk101_walkway.height);
        
        if(polk101_walkway.getContext){
            //exit
            context.drawImage(exit, 0, polk101_walkway.height - exit.height);
            
            //stairs
            context.drawImage(stairs, 35, 150);
            
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(emc_walkway.width - 1, 0);
            context.lineTo(emc_walkway.width - 1, 60);
            context.moveTo(emc_walkway.width - 1, 120);
            context.lineTo(emc_walkway.width - 1, emc_walkway.height);
            context.stroke();
            
            //doorway to polk 101			
            context.drawImage(doorway, polk101_walkway.width - doorway.width / 2, 60);
            
            if(focusPolk101){				
                //display scanner
                context.fillStyle = "#0000FF";
                context.font = 'bold 47px sans-serif';
                context.textAlign = 'center';
                context.fillText("S", polk101_scanner_location[0].x, polk101_scanner_location[0].y);
            }
        }
    }
        
    /***************************
    *												*
    *			2nd FLOOR SOUTH			*
    *												*
    ***************************/

    function toggleValuesInFloorTwoSouth()
    {
        //clear canvas before drawing
        context = floor_two_south.getContext('2d');
        context.clearRect(0, 0, floor_two_south.width, floor_two_south.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, floor_two_south.width, floor_two_south.height);
        
        if(floor_two_south.getContext){
        
            /**********************
            *			LANDMARKS			*
            **********************/
            
            /*
            //place columns			
            context.fillStyle = "#CCCCCC";
            for(var i = 0; i <= 7; i++)
            {
                for(var j = 0; j <= 8; j++)
                {
                    context.fillRect(i * distanceUnit + distanceUnit / 2 - columnDimension / 2, j * distanceUnit + distanceUnit / 2 - columnDimension / 2, columnDimension, columnDimension);
                }
            }
            */
            
            //doorway to walkway			
            context.drawImage(doorway, -30, 592);
            
            //draw in left border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(1, 0);
            context.lineTo(1, 592);
            context.moveTo(1, 652);
            context.lineTo(1, floor_two_south.height);
            context.stroke();
            
            //bathrooms
            context.fillStyle = "#CCCCCC";
            context.fillRect(distanceUnit * 5.5, distanceUnit * 1.5, distanceUnit, distanceUnit * 2.0);
            context.fillRect(distanceUnit * 5.5, distanceUnit * 4.0, distanceUnit, distanceUnit * 2.0);
            
            /**********************
            *			COMPUTERS			*
            **********************/
            
            if(focusFloorTwoSouth){					
                //study room area
                context.fillStyle = "#CCCCCC";
                context.fillRect(3, distanceUnit * 4, distanceUnit / 2 - 3, distanceUnit / 2);
                
                //bathrooms
                context.drawImage(bathroom_male, distanceUnit * 6.25, distanceUnit * 4.2);
                context.drawImage(bathroom_female, distanceUnit * 6.25, distanceUnit * 3.0);
                
                if(showPCs){					
                    //set images to computer locations
                    for(computer in floor_two_south_computer_locations){
                        if(floor_two_south_computers.resources[computer].status == 0)
                            context.drawImage(unavailable, floor_two_south_computer_locations[computer].x, floor_two_south_computer_locations[computer].y);
                        else
                            context.drawImage(available, floor_two_south_computer_locations[computer].x, floor_two_south_computer_locations[computer].y);
                    }
                }
                
                if(showStudyRooms){
                    if(!disable_detailed_arrow){
                        //display more information arrow for 5 seconds
                        var position = $("#floor_two_south").offset();
                        $("#detailed_arrow").css('top', position.top + 240).css('left', position.left - 28).fadeIn().delay(5000).fadeOut();
                        disable_detailed_arrow = true;
                    }
                    
                    context.strokeStyle = "#000000";
                    context.rect(0, distanceUnit * 4, distanceUnit / 2, distanceUnit / 2);
                    context.stroke();
                    
                    if(floor_two_south_studyroom.status == 0){
                        context.fillStyle = "rgba(155, 0, 0, 0.6)";
                        context.fillRect(floor_two_south_studyroom_location[0].x, floor_two_south_studyroom_location[0].y, distanceUnit / 2, distanceUnit / 2);
                        context.drawImage(studyroom_unavailable, (distanceUnit * 0.25) - (studyroom_unavailable.width / 2), (distanceUnit * 4.25) - (studyroom_unavailable.height / 2));
                    }else{
                        context.fillStyle = "rgba(0, 155, 0, 0.6)";
                        context.fillRect(floor_two_south_studyroom_location[0].x, floor_two_south_studyroom_location[0].y, distanceUnit / 2, distanceUnit / 2);
                        context.drawImage(studyroom_available, (distanceUnit * 0.25) - (studyroom_available.width / 2), (distanceUnit * 4.25) - (studyroom_available.height / 2));
                    }
                    
                }
            }
            
            /********************
            *			OVERLAYS			*
            ********************/
            
            if(!focusFloorTwoSouth){
                //green or red overlay
                if(floor_two_south_computers.available / floor_two_south_computers.total <= floor_two_south_ratio)
                    context.fillStyle = "rgba(155, 0, 0, 0.6)";
                else
                    context.fillStyle = "rgba(0, 155, 0, 0.6)";
                
                context.fillRect(0, distanceUnit * 3.5, distanceUnit * 1.5, distanceUnit * 2);
                
                //text overlay				
                context.fillStyle = "#000000";
                context.strokeStyle = "#FFFFFF";
                context.font = 'bold 150px sans-serif';
                context.textAlign = 'center';
                context.lineWidth = 3;
                //the + xx at the end is 1/4 of the size of the font (100px by default)
                //this is done to all numbers that appear in the overlay
                context.fillText(floor_two_south_computers.available, distanceUnit * 1.5 / 2, (distanceUnit * 3.5 + distanceUnit * 5.5) / 2 + 50);
                context.strokeText(floor_two_south_computers.available, distanceUnit * 1.5 / 2, (distanceUnit * 3.5 + distanceUnit * 5.5) / 2 + 50);
            }
        }
    }

    /***************************
    *												*
    *			2nd FLOOR NORTH			*
    *												*
    ***************************/

    function toggleValuesInFloorTwoNorth()
    {
        //clear canvas before drawing
        context = floor_two_north.getContext('2d');
        context.clearRect(0, 0, floor_two_north.width, floor_two_north.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, floor_two_north.width, floor_two_north.height);

        if(floor_two_north.getContext){
        
            /**********************
            *			LANDMARKS			*
            **********************/
            
            /*
            //columns
            context.fillStyle = "#CCCCCC";
            for(var i = 1; i <= 5; i++)
            {
                for(var j = 1; j <= 5; j++)
                {
                    if( !( i == 4 && j == 3 ) && !( i == 5 && j == 3 ) && !( i == 5 && j == 4 ) )
                    {
                        context.beginPath();
                        context.arc(i * distanceUnitTwo - columnDimension / 2, j * distanceUnit - columnDimension / 2, columnDimension / 2, 0, 2 * Math.PI, false);
                        context.fill();
                    }
                }
            }
            */
            
            //north rooms
            context.fillStyle = "#CCCCCC";
            context.fillRect(0, 6.25 * distanceUnit, distanceUnitTwo * 3, 2.5 * distanceUnit);
            
            //south rooms
            context.fillRect(3 * distanceUnitTwo, 6 * distanceUnit, 3 * distanceUnitTwo, 2.75 * distanceUnit);
            
            //study room area
            context.fillRect(floor_two_north_studyroom_location[0].x, floor_two_north_studyroom_location[0].y, distanceUnit * 1.4, distanceUnit);
            
            //stairs and surrounding room
            context.fillRect(3.6 * distanceUnitTwo, distanceUnit + distanceUnitTwo, 1.05 * distanceUnitTwo, 1.16 * distanceUnitTwo);
            context.fillRect(4.5 * distanceUnitTwo, 2.25 * distanceUnit + distanceUnitTwo, .15 * distanceUnitTwo, distanceUnit);
            context.fillRect(4.9 * distanceUnitTwo, distanceUnit + distanceUnitTwo, distanceUnitTwo, 1.8 * distanceUnitTwo);
            context.drawImage(stairs, distanceUnit * 5.1, distanceUnitTwo * 2.5);
            
            //doorway to walkway			
            context.drawImage(doorway, floor_two_north.width - 30, 592);
            
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(floor_two_north.width - 1, 0);
            context.lineTo(floor_two_north.width - 1, 592);
            context.moveTo(floor_two_north.width - 1, 652);
            context.lineTo(floor_two_north.width - 1, floor_two_north.height);
            context.stroke();
            
            if(focusFloorTwoNorth){			
                //bathrooms
                context.drawImage(bathroom_male, distanceUnit * 5.6, distanceUnit * 2.7);
                context.drawImage(bathroom_female, distanceUnit * 5.6, distanceUnit * 2.25);
            
                //draw computer table
                context.drawImage(small_desk, distanceUnitTwo * 3.735, distanceUnit * 3.7);
                
                if(showPCs){
                    //set images to computer locations
                    for(computer in floor_two_north_computer_locations){
                        if(floor_two_north_computers.resources[computer].status == 0)
                            context.drawImage(unavailable, floor_two_north_computer_locations[computer].x, floor_two_north_computer_locations[computer].y);
                        else
                            context.drawImage(available, floor_two_north_computer_locations[computer].x, floor_two_north_computer_locations[computer].y);
                    }
                }

                if(showRooms){
                    if(!disable_detailed_arrow){
                        //display more information arrow for 5 seconds
                        var position = $("#floor_two_north").offset();
                        $("#detailed_arrow").css('top', position.top + 90).css('left', position.left + 368).fadeIn().delay(5000).fadeOut();
                        disable_detailed_arrow = true;
                    }
                
                    //study room area
                    context.strokeStyle = "#000000";
                    context.rect(3.4 * distanceUnitTwo, distanceUnit + distanceUnitTwo, distanceUnit * 1.2, distanceUnit);
                    context.stroke();
                    
                    if(floor_two_north_studyroom.status == 0){
                        context.fillStyle = "rgba(155, 0, 0, 0.6)";
                        context.fillRect(floor_two_north_studyroom_location[0].x, floor_two_north_studyroom_location[0].y, distanceUnit * 1.2, distanceUnit);
                        context.drawImage(studyroom_unavailable, floor_two_north_studyroom_location[0].x + (distanceUnit * 0.6) - (studyroom_unavailable.width / 2), floor_two_north_studyroom_location[0].y + (distanceUnit / 2) - (studyroom_unavailable.height / 2));
                    }else{
                        context.fillStyle = "rgba(0, 155, 0, 0.6)";
                        context.fillRect(floor_two_north_studyroom_location[0].x, floor_two_north_studyroom_location[0].y, distanceUnit * 1.2, distanceUnit);
                        context.drawImage(studyroom_available, floor_two_north_studyroom_location[0].x + (distanceUnit * 0.6) - (studyroom_available.width / 2), floor_two_north_studyroom_location[0].y + (distanceUnit / 2) - (studyroom_available.height / 2));
                    }
                }
            }	
            
            /********************
            *			OVERLAYS			*
            ********************/
            
            if(!focusFloorTwoNorth){
                //green or red overlay
                if(floor_two_north_computers.available / floor_two_north_computers.total <= floor_two_north_ratio)
                    context.fillStyle = "rgba(155, 0, 0, 0.6)";
                else
                    context.fillStyle = "rgba(0, 155, 0, 0.6)";
                    
                context.fillRect(distanceUnitTwo * 3.5, distanceUnit * 3.5, distanceUnitTwo, distanceUnit * 1.25);
                
                //text overlay				
                context.fillStyle = "#000000";
                context.strokeStyle = "#FFFFFF";
                context.font = 'bold 140px sans-serif';
                context.textAlign = 'center';
                context.lineWidth = 3;
                //the + xx at the end is 1/4 of the size of the font (100px by default)
                //this is done to all numbers that appear in the overlay
                context.fillText(floor_two_north_computers.available, (distanceUnitTwo * 3.5 + distanceUnitTwo * 4.5) / 2, (distanceUnit * 3.5 + distanceUnit * 5) / 2 + 35);
                context.strokeText(floor_two_north_computers.available, (distanceUnitTwo * 3.5 + distanceUnitTwo * 4.5) / 2, (distanceUnit * 3.5 + distanceUnit * 5) / 2 + 35);
            }
        }
    }

    /*****************************
    *													*
    *		2nd FLOOR NORTH WALKWAY		*
    *													*
    *****************************/
    
    function toggleValuesInFloorTwoNorthWalkway()
    {
        //clear canvas before drawing
        context = floor_two_north_walkway.getContext('2d');
        context.clearRect(0, 0, floor_two_north_walkway.width, floor_two_north_walkway.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, floor_two_north_walkway.width, floor_two_north_walkway.height);
        
        if(floor_two_north_walkway.getContext){
            //draw in left border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(1, 0);
            context.lineTo(1, 60);
            context.moveTo(1, 120);
            context.lineTo(1, floor_two_north_walkway.height);
            context.stroke();
            
            //doorway to floor two north		
            context.drawImage(doorway, -1 * doorway.width / 2, 60);
            
            //air
            context.fillStyle = "#CCCCCC";
            context.fillRect(2, 0, floor_two_north_walkway.width, 40);
            context.fillRect(2, 140, floor_two_north_walkway.width, floor_two_north_walkway.height);
        }
    }
    
    /*******************************
    *														*
    *			2nd FLOOR SOUTH WALKWAY		*
    *														*
    ********************************/
    
    function toggleValuesInFloorTwoSouthWalkway()
    {
        //clear canvas before drawing
        context = floor_two_south_walkway.getContext('2d');
        context.clearRect(0, 0, floor_two_south_walkway.width, floor_two_south_walkway.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, floor_two_south_walkway.width, floor_two_south_walkway.height);
        
        if(floor_two_south_walkway.getContext){			
            //stairs
            context.drawImage(stairs, floor_two_south_walkway.width - stairs.width, 150);
            
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(floor_two_south_walkway.width - 1, 0);
            context.lineTo(floor_two_south_walkway.width - 1, 60);
            context.moveTo(floor_two_south_walkway.width - 1, 120);
            context.lineTo(floor_two_south_walkway.width - 1, floor_two_north_walkway.height);
            context.stroke();
            
            //doorway to floor two south		
            context.drawImage(doorway, floor_two_south_walkway.width - doorway.width / 2, 60);
            
            //air
            context.fillStyle = "#CCCCCC";
            context.fillRect(0, 0, floor_two_south_walkway.width - 2, 40);
            context.fillRect(0, 140, 30, floor_two_south_walkway.height);
        }
    }
    
    /***************************
    *												*
    *			3rd FLOOR SOUTH			*
    *												*
    ***************************/
    
    function toggleValuesInFloorThreeSouth()
    {
        //clear canvas before drawing
        context = floor_three_south.getContext('2d');
        context.clearRect(0, 0, floor_three_south.width, floor_three_south.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, floor_three_south.width, floor_three_south.height);

        if(floor_three_south.getContext){		
            /*
            //place columns
            context.fillStyle = "#CCCCCC";
            for(var i = 1; i <= 5; i++)
            {
                for(var j = 1; j <= 4; j++)
                    context.fillRect(distanceUnit / 2 + (i * distanceUnit) - (columnDimension / 2), distanceUnit / 2 + (j * distanceUnit) - (columnDimension / 2), columnDimension, columnDimension);
            }
            */

            //offices
            context.fillStyle = "#CCCCCC";
            context.fillRect(0, 0, distanceUnit / 2, floor_three_south.height);
            context.fillRect(0, 0, floor_three_south.width, distanceUnit / 2);
            context.fillRect(floor_three_south.width - distanceUnit / 2.25, 0, distanceUnit / 2, floor_three_south.height);
            context.fillRect(0, distanceUnit * 3, distanceUnit * 2 / 3, distanceUnit * 2 / 3);
            context.fillRect(0, distanceUnit * 3.5 - columnDimension / 2, distanceUnit * 1.6, distanceUnit * 2 / 3);
            context.fillRect(0, distanceUnit * 3.5, distanceUnit * 1.5 / 2, distanceUnit * 2);
            
            //archives
            context.fillStyle = "#CCCCCC";
            context.fillRect(distanceUnit * 1.5, distanceUnit * 5.5, distanceUnit * 3, distanceUnitTwo * 3);
            context.fillRect(0, distanceUnit * 6.5, distanceUnit * 1.5, distanceUnit * 2.5);
            
            //bathroom
            context.fillRect(distanceUnit * 5.5 - columnDimension / 2, distanceUnit * 3.5 - columnDimension / 2, distanceUnit * 0.9, distanceUnit * 2.3);
            
            //bottom-right room
            context.fillRect(distanceUnit * 5.5 - columnDimension / 2, distanceUnit * 6, distanceUnit * 2, distanceUnit * 2.5);
            
            //doorway to walkway			
            context.drawImage(doorway, -30, 592);
            
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(1, 0);
            context.lineTo(1, 592);
            context.moveTo(1, 652);
            context.lineTo(1, floor_three_south.height);
            context.stroke();
            
            /**********************
            *			COMPUTERS			*
            **********************/
            
            if(focusFloorThreeSouth){			
                //bathrooms
                context.drawImage(bathroom_male, distanceUnit * 6.0, distanceUnit * 4.0);
                context.drawImage(bathroom_female, distanceUnit * 6.0, distanceUnit * 4.5);

                /*
                context.fillStyle = "#FFFFFF";
                context.strokeStyle = "#000000";
                context.fillRect(0, distanceUnit * 3, distanceUnit * 2 / 3, distanceUnit * 0.45);
                context.rect(0, distanceUnit * 3, distanceUnit * 2 / 3, distanceUnit * 0.45);
                context.stroke();
                */
            
                //computer table
                context.strokeStyle = "#000000";
                context.rect(distanceUnit * 1.25, distanceUnit * 4.5, distanceUnit / 3, distanceUnit / 2);
                context.stroke();
                
                if(showPCs){
                    //set images to computer locations
                    for(computer in floor_three_south_computer_locations){
                        if(floor_three_south_computers.resources[computer].status == 0)
                            context.drawImage(unavailable, floor_three_south_computer_locations[computer].x, floor_three_south_computer_locations[computer].y);
                        else
                            context.drawImage(available, floor_three_south_computer_locations[computer].x, floor_three_south_computer_locations[computer].y);
                    }
                }
                
                //display printer
                context.fillStyle = "#0000FF";
                context.font = 'bold 50px sans-serif';
                context.textAlign = 'center';
                context.fillText("P", floor_three_south_printer_location[0].x, floor_three_south_printer_location[0].y);
            }
            
            /********************
            *			OVERLAYS			*
            ********************/
            
            if(!focusFloorThreeSouth){
                //green or red overlay
                if(floor_three_south_computers.available / floor_three_south_computers.total <= floor_three_south_ratio)
                    context.fillStyle = "rgba(155, 0, 0, 0.6)";
                else
                    context.fillStyle = "rgba(0, 155, 0, 0.6)";
                    
                context.fillRect(distanceUnit * .85, distanceUnit * 4.25, distanceUnit, distanceUnit);
                
                //text overlay				
                context.fillStyle = "#000000";
                context.strokeStyle = "#FFFFFF";
                context.font = 'bold 120px sans-serif';
                context.textAlign = 'center';
                context.lineWidth = 3;
                //the + xx at the end is 1/4 of the size of the font (100px by default)
                //this is done to all numbers that appear in the overlay
                context.fillText(floor_three_south_computers.available, distanceUnit * 1.35, distanceUnit * 5.1);
                context.strokeText(floor_three_south_computers.available, distanceUnit * 1.35, distanceUnit * 5.1);
            }
        }
    }

    /***************************
    *												*
    *			3rd FLOOR NORTH			*
    *												*
    ***************************/
    
    function toggleValuesInFloorThreeNorth()
    {
        //clear canvas before drawing
        context = floor_three_north.getContext('2d');
        context.clearRect(0, 0, floor_three_north.width, floor_three_north.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, floor_three_north.width, floor_three_north.height);

        if(floor_three_north.getContext){
            //place columns
            /*
            context.fillStyle = "#CCCCCC";
            for(var i = 1; i <= 3; i++)
            {
                for(var j = 1; j <= 6; j++)
                {
                    context.fillRect((i * distanceUnitTwo) - (columnDimension / 2), (j * distanceUnit) - (columnDimension / 2), columnDimension, columnDimension);
                }
            }
            */
            
            //rooms
            context.fillStyle = "#CCCCCC";
            context.fillRect(floor_three_north.width - 2.1 * distanceUnitTwo, 0, 4, floor_three_north.height);
            context.fillRect(floor_three_north.width - 2.1 * distanceUnitTwo, 0, distanceUnitTwo * 2.1, distanceUnit * 2.5);
            context.fillRect(floor_three_north.width - 2.1 * distanceUnitTwo, 0, distanceUnitTwo * 1.1, distanceUnit * 3.5);
            context.fillRect(floor_three_north.width - (distanceUnit + distanceUnitTwo), distanceUnit * 4, distanceUnit, distanceUnit * 1.3);
            context.fillRect(floor_three_north.width - 1.5 * distanceUnitTwo, distanceUnit * 4, distanceUnit * 2, distanceUnit * 0.7);
            context.fillRect(floor_three_north.width - 2.1 * distanceUnitTwo, floor_three_north.height - distanceUnitTwo * 1.8, distanceUnitTwo * 2.1, distanceUnitTwo * 1.8);
            context.fillRect(0, distanceUnit * 6.5, floor_three_north.width, distanceUnitTwo * 2);
            
            //stairs
            context.drawImage(stairs, distanceUnit * 4.8, distanceUnitTwo * 2.2);
            
            //doorway to walkway			
            context.drawImage(doorway, floor_three_north.width - 30, 592);
            
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(floor_three_north.width - 1, 0);
            context.lineTo(floor_three_north.width - 1, 592);
            context.moveTo(floor_three_north.width - 1, 652);
            context.lineTo(floor_three_north.width - 1, floor_three_north.height);
            context.stroke();
            
            /******************
            *		COMPUTERS		*
            ******************/
            
            if(focusFloorThreeNorth){				
                //bathrooms
                context.drawImage(bathroom_male, distanceUnit * 6.1, distanceUnit * 4.1);
                context.drawImage(bathroom_female, distanceUnit * 6.6, distanceUnit * 4.1);
                
                //trapezoid table
                context.drawImage(trapezoid_table, distanceUnit * 3.8, distanceUnitTwo * 3.4);
                                
                if(showPCs){
                    //set images to computer locations
                    for(computer in floor_three_north_computer_locations){
                        if(floor_three_north_computers.resources[computer].status == 0)
                            context.drawImage(unavailable, floor_three_north_computer_locations[computer].x, floor_three_north_computer_locations[computer].y);
                        else
                            context.drawImage(available, floor_three_north_computer_locations[computer].x, floor_three_north_computer_locations[computer].y);
                    }
                }
                
                if(showStudyRooms){
                    if(!disable_detailed_arrow){
                        //display more information arrow for 5 seconds
                        var position = $("#floor_three_north").offset();
                        $("#detailed_arrow").css('top', position.top + 390).css('left', position.left + 495).fadeIn().delay(5000).fadeOut();
                        disable_detailed_arrow = true;
                    }
                    
                    context.strokeStyle = "#000000";
                    context.rect(floor_three_north_studyroom_location[0].x, floor_three_north_studyroom_location[0].y, distanceUnitTwo, distanceUnit * 0.9);
                    context.stroke();
                    
                    if(floor_three_north_studyroom.status == 0){
                        context.fillStyle = "rgba(155, 0, 0, 0.6)";
                        context.fillRect(floor_three_north_studyroom_location[0].x, floor_three_north_studyroom_location[0].y, distanceUnitTwo, distanceUnit * 0.9);
                        context.drawImage(studyroom_unavailable, floor_three_north_studyroom_location[0].x + (distanceUnitTwo / 2) - (studyroom_unavailable.width / 2), floor_three_north_studyroom_location[0].y + (distanceUnit * 0.45) - (studyroom_unavailable.height / 2));
                    }else{
                        context.fillStyle = "rgba(0, 155, 0, 0.6)";
                        context.fillRect(floor_three_north_studyroom_location[0].x, floor_three_north_studyroom_location[0].y, distanceUnitTwo, distanceUnit * 0.9);
                        context.drawImage(studyroom_available, floor_three_north_studyroom_location[0].x + (distanceUnitTwo / 2) - (studyroom_available.width / 2), floor_three_north_studyroom_location[0].y + (distanceUnit * 0.45) - (studyroom_available.height / 2));
                    }
                }
            }
            
            /********************
            *			OVERLAYS			*
            ********************/
            
            if(!focusFloorThreeNorth){
                //green or red overlay
                if(floor_three_north_computers.available / floor_three_north_computers.total <= floor_three_north_ratio)
                    context.fillStyle = "rgba(155, 0, 0, 0.6)";
                else
                    context.fillStyle = "rgba(0, 155, 0, 0.6)";
                    
                context.fillRect(distanceUnitTwo * 3, distanceUnit * 4, distanceUnit, distanceUnit);
                
                //text overlay				
                context.fillStyle = "#000000";
                context.strokeStyle = "#FFFFFF";
                context.font = 'bold 120px sans-serif';
                context.textAlign = 'center';
                context.lineWidth = 3;
                //the + xx at the end is 1/4 of the size of the font (100px by default)
                //this is done to all numbers that appear in the overlay
                context.fillText(floor_three_north_computers.available, distanceUnitTwo * 3.4, distanceUnit * 4.8);
                context.strokeText(floor_three_north_computers.available, distanceUnitTwo * 3.4, distanceUnit * 4.8);
            }
        }
    }

    /*****************************
    *													*
    *		3rd FLOOR NORTH WALKWAY		*
    *													*
    *****************************/
    
    function toggleValuesInFloorThreeNorthWalkway()
    {
        //clear canvas before drawing
        context = floor_three_north_walkway.getContext('2d');
        context.clearRect(0, 0, floor_three_north_walkway.width, floor_three_north_walkway.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, floor_three_north_walkway.width, floor_three_north_walkway.height);
        
        if(floor_three_north_walkway.getContext){			
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(1, 0);
            context.lineTo(1, 60);
            context.moveTo(1, 120);
            context.lineTo(1, floor_three_north_walkway.height);
            context.stroke();
            
            //doorway			
            context.drawImage(doorway, -30, 60);
            
            //air
            context.fillStyle = "#CCCCCC";
            context.fillRect(2, 0, floor_three_north_walkway.width, 40);
            context.fillRect(2, 140, floor_three_north_walkway.width, floor_three_north_walkway.height);
        }
    }
    
    /*******************************
    *														*
    *			3rd FLOOR SOUTH WALKWAY		*
    *														*
    ********************************/
    
    function toggleValuesInFloorThreeSouthWalkway()
    {
        //clear canvas before drawing
        context = floor_three_south_walkway.getContext('2d');
        context.clearRect(0, 0, floor_three_south_walkway.width, floor_three_south_walkway.height);
        //white background
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, floor_three_south_walkway.width, floor_three_south_walkway.height);
        
        if(floor_three_south_walkway.getContext){
            //stairs
            context.drawImage(stairs, floor_three_south_walkway.width - stairs.width, 150);
            
            //draw in right border
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(floor_three_south_walkway.width - 1, 0);
            context.lineTo(floor_three_south_walkway.width - 1, 60);
            context.moveTo(floor_three_south_walkway.width - 1, 120);
            context.lineTo(floor_three_south_walkway.width - 1, floor_three_south_walkway.height);
            context.stroke();
            
            //doorways to fts
            context.drawImage(doorway, floor_three_south_walkway.width - doorway.width / 2, 60);
            
            //air
            context.fillStyle = "#CCCCCC";
            context.fillRect(0, 0, floor_three_south_walkway.width - 2, 40);
            context.fillRect(0, 140, 30, floor_three_south_walkway.height);
        }
    }
    
    function toggleValues()
    {
		
        toggleValuesInPolk101();
        toggleValuesInEMC();
        toggleValuesInEMCWalkway();
        toggleValuesInPolk101Walkway();
        toggleValuesInFloorTwoSouth();
        toggleValuesInFloorTwoNorth();
        toggleValuesInFloorTwoNorthWalkway();
        toggleValuesInFloorTwoSouthWalkway();
        toggleValuesInFloorThreeSouth();
        toggleValuesInFloorThreeNorth();
        toggleValuesInFloorThreeNorthWalkway();	
        toggleValuesInFloorThreeSouthWalkway();	
    }

    //main
    $("#detailed_floor_one_tab, #detailed_floor_two_tab, #detailed_floor_three_tab").hide();
    update();
    setInterval(update, time_interval * 1000);
    
    //legend toggles	
    $(".showStudyRooms").click(function(){
		if(isClickable){
			if(showStudyRooms){
				showStudyRooms = false;
				$(".showStudyRooms_light").css({ backgroundColor: '#666', boxShadow: '0px 0px 0px 0px #000' });
			}else{
				showStudyRooms = true;
				$(".showStudyRooms_light").css({ backgroundColor: '#DE8', boxShadow: 'inset 0 0 5px #DDD' });
			}
			toggleValues();
		}
    });
    
    $(".showPCs").click(function(){
		if(isClickable){
			if(showPCs){
				showPCs = false;
				$(".showPCs_light").css({ backgroundColor: '#666', boxShadow: '0px 0px 0px 0px #000' });
			}else{
				showPCs = true;
				$(".showPCs_light").css({ backgroundColor: '#DE8', boxShadow: 'inset 0 0 5px #DDD' });
			}
			toggleValues();
		}
    });
    
    $(".showMacs").click(function(){
		if(isClickable){
			if(showMacs){
				showMacs = false;
				$(".showMacs_light").css({ backgroundColor: '#666', boxShadow: '0px 0px 0px 0px #000' });
			}else{
				showMacs = true;
				$(".showMacs_light").css({ backgroundColor: '#DE8', boxShadow: 'inset 0 0 5px #DDD' });
			}
			toggleValues();
		}
    });
    
    //close popup
    $("#popup").click(function(){
		if(isClickable){
			$("#popup").fadeOut();
			popup_is_visible = false;
		}
    });
    
    //back button
    $("#back").click(function(){
		if(isClickable){
			$("#popup").hide();
			popup_is_visible = false;
			$("#detailed_arrow").hide();
			$("canvas").not(":hidden").trigger("click");
		}
    });
    
    //create a groupfinder session
    $("#popup_button").click(function(){
		if(isClickable){
			window.location = groupfinder_location;
		}
	});
    
    $("#detailed_arrow").click(function(){
		if(isClickable){
			$(this).hide();
		}
    });
    
    /*****************************
    *													*
    *			CLICK WITHIN FLOORS			*
    *													*
    *****************************/
    
    //computer status, locations of computers, x and y position of mouse modified for the canvas position, x and y absolute mouse positions, string of "PC" or "Mac"
    function checkIfClickOnComputer(computers, locations, x_position, y_position, mouse_x, mouse_y, type)
    {
		
        for(computer in locations){
            if(	(locations[computer].x - 10 <= x_position && x_position <= locations[computer].x + 30) && (locations[computer].y - 10 <= y_position && y_position <= locations[computer].y + 30)){				
                //prepare popup size
                $("#popup").css({ width: "70px", height: "30px" });
                
                //move popup to this location
                if(computers.resources[computer].status == 1){
                    $("#popup_title, #popup_button").hide();
                    $("#popup_context").html(type + " Available " + locations[computer].name);
                    $("#popup").css('left', mouse_x).css('top', mouse_y).fadeIn();
                }else{
                    $("#popup_title, #popup_button").hide();
                    $("#popup_context").html(type + " Unavailable " + locations[computer].name);
                    $("#popup").css('left', mouse_x).css('top', mouse_y).fadeIn();
                }
                popup_is_visible = true;
                return true;
            }
        }
    }
    
    //printer or scanner locations, x and y position of mouse modified for the canvas position, x and y absolute mouse positions, string of "Printer" or "Scanner"
    function checkIfClickOnPrinter(locations, x_position, y_position, mouse_x, mouse_y, type)
    {
		
        for(printer in locations){
            if( (locations[printer].x - 20 <= x_position && x_position <= locations[printer].x + 20) && (locations[printer].y - 40 <= y_position && y_position <= locations[printer].y + 20)){
                //prepare popup size
                $("#popup").css({ width: "60px", height: "15px" });
                
                //move popup to this location
                $("#popup_title, #popup_button").hide();
                $("#popup_context").html(type);
                $("#popup").css('left', mouse_x).css('top', mouse_y).fadeIn();
                popup_is_visible = true;
                return true;
            }
        }
    }
    
    //studyroom, studyroom location, x and y dimensions of studyroom, x and y position of studyroom, x and y absolute mouse positions
    function checkIfClickOnStudyRoom(studyroom, location, studyroom_width, studyroom_height, x_position, y_position, mouse_x, mouse_y)
    {
		return false;
       /* if(	(location[0].x <= x_position && x_position <= location[0].x + studyroom_width) && (location[0].y <= y_position && y_position <= location[0].y + studyroom_height)){
            //prepare popup size
            $("#popup").css({ width: "200px", height: "45px" });
            
            //move popup to this location
            if(studyroom.status == 1){
                $("#popup").css('left', mouse_x).css('top', mouse_y).fadeIn();
                $("#popup_title").show().html(studyroom.name);
                $("#popup_title").append("<div>Currently Available</div>");
            }else{
                $("#popup").css('left', mouse_x).css('top', mouse_y).fadeIn();
                $("#popup_title").html(studyroom.name);
                $("#popup_title").append("<div>Currently Unavailable</div>");
            }
            
            //button to schedule a group
            $("#popup").height( $("#popup").height() + 80 );
            $("#popup_button").show();
            
            //schedule for the room
            if(studyroom.events[0]){
                $("#popup").height( $("#popup").height() + 25 );
                $("#popup_context").html("<div style='text-align: center'>_________________________</div>");
                $("#popup_context").append("<div style='font-weight: bold'>Schedule for " + studyroom.events[0].date_start + ":</div>");
                
                for(event in floor_two_north_studyroom.events){
                    $("#popup").height( $("#popup").height() + 15 );
                    $("#popup_context").append("<div>" + studyroom.events[event].time_start + " - " + studyroom.events[event].time_end + "</div>");
                }
            }else{
                $("#popup").height( $("#popup").height() + 25 );
                $("#popup_context").html("<div style='text-align: center'>_________________________</div>");
                $("#popup_context").append("<div style='font-weight: bold'>No events scheduled today.</div>");
            }
            popup_is_visible = true;
            return true;
        }*/
    }
    
    /*******************************
    *														*
    *				FLOOR ANIMATIONS				*
    *														*
    ********************************/
    
    function deFocusFloorOneAnimate(primaryId, primaryId_walkway, primary_floor, primary_floor_tab, primary_floor_detailed_tab, secondaryId, secondaryId_walkway, secondary_floors)
    {
		isClickable = false;
		
        $(primaryId)
            .css({ zIndex: '5', boxShadow: '0px 0px 0px 0px #CCC' })
            .stop(true, true)
            .animate({ height: '300px', width: '300px' }, 500);
        $(primaryId_walkway)
            .css({ boxShadow: '0px 0px 0px 0px #CCC' })
            .stop(true, true)
            .animate({ marginTop: '183px', height: '95px', width: '42px' }, 500);
        $(primary_floor)
            .stop(true, true)
            .animate({ height: '310px' }, 500);
        $(primary_floor_tab).show();
        $(primary_floor_detailed_tab).hide();
        $(secondaryId)
            .css({ height: '300px', width: '0px' })
            .stop(true, true)
            .show()
            .animate({ height: '300px', width: '300px', border: '1px solid black', borderRight: '0px' }, 500, 
                function(){
                    $(secondary_floors)
                        .animate({ height: '352px' }, 500);
                });
        $(secondaryId_walkway)
            .stop(true, true)
            .show()
            .animate({ height: '95px', width: '42px' }, 500);
        $("#back").hide();
        $("#detailed_arrow").hide();
		setTimeout(function(){isClickable = true;}, 500);
    }
    
    function focusFloorOneAnimate(	primaryId, primaryId_walkway, primary_floor, primary_floor_string, secondary_floors, secondaryId, secondaryId_walkway, primaryId_orientation, 
                                                primaryId_pcs, primaryId_macs, scanner, photocopier)
    {
		isClickable = false;
		
        $("html, body")
            .animate({ scrollTop: $(primary_floor).offset().top }, 500);
        $(secondary_floors)
            .stop(true, true)
            .animate({ height: '0px' }, 500,
            function(){ $(secondary_floors).hide(); });
        $(primary_floor)
            .stop(true, true)
            .animate({ height: '620px' }, 500);
        $(primaryId)
            .css({ boxShadow: '3px 3px 10px 3px #CCC' })
            .stop(true, true)
            .animate({ marginLeft: '0px', height: '600px', width: '600px' }, 500);
        $(primaryId_walkway)
            .css({ boxShadow: '3px 3px 10px 3px #CCC' })
            .stop(true, true)
            .animate({ marginTop: '366px', height: '190px', width: '84px' }, 500);
        $("#floor_one_tab").hide();
        $("#detailed_floor_one_tab .floor_header").html(primary_floor_string);
        $("#detailed_floor_one_tab .floor_sub_header").html(primaryId_orientation);
        $("#detailed_floor_one_tab .showMacs_text").html(primaryId_macs);
        $("#detailed_floor_one_tab .showPCs_text").html(primaryId_pcs);
        $("#detailed_floor_one_tab").show();
        $(".printer").show();
        $(".bathroom").show();
        if(scanner)
            $(".scanner").show();
        else
            $(".scanner").hide();
        if(photocopier)
            $(".photocopier").show();
        else
            $(".photocopier").hide();
        $("#back").show();
        $(secondaryId)
            .stop(true, true)
            .animate({ height: '300px', width: '0px', border: '0px' }, 500, function(){ $(this).hide(); });
        $(secondaryId_walkway)
            .stop(true, true)
            .animate({ height: '95px', width: '0px' }, 500, function(){ $(this).hide(); });
		setTimeout(function(){isClickable = true;}, 500);
    }
    
    function deFocusFloorTwoThreeAnimate(primaryId, primaryId_walkway, primary_floor, primary_floor_tab, primary_floor_detailed_tab, secondaryId, secondaryId_walkway, secondary_floor, terciary_floor)
    {
		isClickable = false;
		
        $(primaryId)
            .css({ zIndex: '5', boxShadow: '0px 0px 0px 0px #CCC' })
            .stop(true, true)
            .animate({ height: '342px', width: '300px' }, 500);
        $(secondaryId_walkway).show();
        $(primaryId_walkway)
            .css({ boxShadow: '0px 0px 0px 0px #CCC' })
            .stop(true, true)
            .animate({ marginTop: '190px', height: '95px', width: '42px' }, 500);
        $(primary_floor)
            .stop(true, true)
            .animate({ height: '352px' }, 500);
        $(primary_floor_tab).show();
        $(primary_floor_detailed_tab).hide();
        $(secondaryId)
            .css({ height: '342px', width: '0px' })
            .stop(true, true)
            .show()
            .animate({ height: '342px', width: '300px', border: '1px solid black', borderLeft: '0px' }, 500, 
                function(){
                    $(secondary_floor)
                        .animate({ height: '310px' }, 500);
                    $(terciary_floor)
                        .animate({ height: '352px' }, 500);
                });
        $("#back").hide();
        $("#detailed_arrow").hide();
		setTimeout(function(){isClickable = true;}, 500);
    }
    
    function focusFloorTwoThreeAnimate(	primaryId, primaryId_walkway, primary_floor, primary_floor_string, secondary_floor, secondaryId, secondaryId_walkway, primaryId_orientation, pcs, primary_tab, 
                                                        primary_tab_header, primary_tab_sub, primary_showPCs, primary_detailed, printer, photocopier)
    {
		isClickable = false;
		
        $("html, body")
            .animate({ scrollTop: $("#floor_one").offset().top }, 500);
        $("#floor_one")
            .stop(true, true)
            .animate({ height: '0px' }, 500,
            function(){ $("#floor_one").hide(); });
        $(secondary_floor)
            .stop(true, true)
            .animate({ height: '0px' }, 500,
            function(){ $(secondary_floor).hide(); });
        $(primary_floor)
            .stop(true, true)
            .animate({ height: '704px' }, 500);
        $(primaryId)
            .css({ boxShadow: '3px 3px 10px 3px #CCC' })
            .stop(true, true)
            .animate({ height: '684px', width: '600px' }, 500);
        $(secondaryId_walkway).hide();
        $(primaryId_walkway)
            .css({ boxShadow: '3px 3px 10px 3px #CCC' })
            .stop(true, true)
            .animate({ marginTop: '380px', height: '190px', width: '84px' }, 500);
        $(primary_tab).hide();
        $(primary_tab_header).html(primary_floor_string);
        $(primary_tab_sub).html(primaryId_orientation);
        $(primary_showPCs).html(pcs);
        $(primary_detailed).show();
        $(".photocopier").hide();
        $(".bathroom").show();
        if(printer)
            $(".printer").show();
        else
            $(".printer").hide();
        if(photocopier)
            $(".photocopier").show();
        else
            $(".photocopier").hide();
        $("#back").show();
        $(secondaryId)
            .stop(true, true)
            .animate({ height: '300px', width: '0px', border: '0px' }, 500, 
                function(){
                    $(this).hide();
                    $(".transition_floor").fadeIn();
                    $(".transition_side").css({ marginTop: '595px' }).fadeIn();
            });
		setTimeout(function(){isClickable = true;}, 500);
    }
        
    /*******************************
    *														*
    *				CLICK ON FLOORS				*
    *														*
    ********************************/
    
    //all of the focus animations will blow up the selected floor side (North/South) to 2.0x its original size, including the connected walkway
    
    //focus polk101	
    $("#polk101").click(function(e){
		if(isClickable){
			if(focusPolk101){
				//get mouse position relative to polk101			
				var x_position = 1.4 * (e.pageX - ($("#polk101").position().left + $("#floor_one").position().left));
				var y_position = 1.4 * (e.pageY - ($("#polk101").position().top + $("#floor_one").position().top));
				
				var pc_found = checkIfClickOnComputer(polk101_computers, polk101_computer_locations, x_position, y_position, e.pageX, e.pageY, "PC");			
				var mac_found = checkIfClickOnComputer(polk101_macs, polk101_mac_locations, x_position, y_position, e.pageX, e.pageY, "Mac");
				var printer_found = checkIfClickOnPrinter(polk101_printer_locations, x_position, y_position, e.pageX, e.pageY, "Printer");
				
				if(!pc_found && !mac_found && !printer_found && popup_is_visible){
					$("#popup").fadeOut();
					popup_is_visible = false;
				}
				
				//zoom out
				else if(!pc_found && !mac_found && !printer_found && !popup_is_visible){
					deFocusFloorOneAnimate("#polk101", "#polk101_walkway", "#floor_one", "#floor_one_tab", "#detailed_floor_one_tab", "#emc", "#emc_walkway", "#floor_two, #floor_three");
					focusPolk101 = false;
					toggleValues();	
				}
			}else{
				var pcs = polk101_computers.available + " / " + polk101_computers.total + " PCs";
				var macs = polk101_macs.available + " / " + polk101_macs.total + " Macs";
				focusFloorOneAnimate("#polk101", "#polk101_walkway", "#floor_one", "1st Floor", "#floor_two, #floor_three", "#emc", "#emc_walkway", "(South)", pcs, macs, true, true);
				focusPolk101 = true;
				toggleValues();
			}
		}
	});
    
    //polk101 walkway
    $("#polk101_walkway").click(function(e){
		if(isClickable){
			if(focusPolk101){
				//the 366 being added in is the top margin of polk101_walkway
				var x_position = (e.pageX - ($("#polk101_walkway").position().left + $("#floor_one").position().left));
				var y_position = (e.pageY - ($("#polk101_walkway").position().top + $("#floor_one").position().top + 366));
				
				//scanner
				if((polk101_scanner_location[0].x - 50 <= x_position && x_position <= polk101_scanner_location[0].x + 10) && (polk101_scanner_location[0].y - 80 <= y_position && y_position <= polk101_scanner_location[0].y - 20)){
					var scanner_found = true;
					$("#popup").css({ width: "60px", height: "15px" });					//prepare popup size
					$("#popup_title, #popup_button").hide();								//move popup to this location
					$("#popup_context").html("Scanner")
					$("#popup").css('left', e.pageX).css('top', e.pageY).fadeIn();
					popup_is_visible = true;
				}
				
				if(!scanner_found && popup_is_visible){
					$("#popup").fadeOut();
					popup_is_visible = false;
				}
			}
		}
    });

    //focus emc
    $("#emc").click(function(e){
		if(isClickable){
			if(focusEMC){
				//get mouse position relative to EMC
				var x_position = 1.4 * (e.pageX - ($("#emc").position().left + $("#floor_one").position().left));
				var y_position = 1.4 * (e.pageY - ($("#emc").position().top + $("#floor_one").position().top));
				
				var pc_found = checkIfClickOnComputer(emc_computers, emc_computer_locations, x_position, y_position, e.pageX, e.pageY, "PC");
				if(!pc_found)
					var pc_found = checkIfClickOnComputer(lab_computers, lab_computer_locations, x_position, y_position, e.pageX, e.pageY, "PC");	
				var mac_found = checkIfClickOnComputer(emc_macs, emc_mac_locations, x_position, y_position, e.pageX, e.pageY, "Mac");
				if(!mac_found)
					var mac_found = checkIfClickOnComputer(lab_macs, lab_mac_locations, x_position, y_position, e.pageX, e.pageY, "Mac");
				var printer_found = checkIfClickOnPrinter(emc_printer_location, x_position, y_position, e.pageX, e.pageY, "Printer");
				
				if(!pc_found && !mac_found && !printer_found && popup_is_visible){
					$("#popup").fadeOut();
					popup_is_visible = false;
				}
				
				//zoom out
				else if(!pc_found && !mac_found && !printer_found && !popup_is_visible){
					deFocusFloorOneAnimate("#emc", "#emc_walkway", "#floor_one", "#floor_one_tab", "#detailed_floor_one_tab", "#polk101", "#polk101_walkway", "#floor_two, #floor_three");
					focusEMC = false;
					toggleValues();
				}
			}else{
				var pcs = (emc_computers.available + lab_computers.available) + " / " + (emc_computers.total + lab_computers.total) + " PCs";
				var macs = (emc_macs.available + lab_macs.available) + " / " + (emc_macs.total + lab_macs.total) + " Macs";
				focusFloorOneAnimate("#emc", "#emc_walkway", "#floor_one", "1st Floor", "#floor_two, #floor_three", "#polk101", "#polk101_walkway", "(North)", pcs, macs, false, false);
				focusEMC = true;
				toggleValues();
			}
		}
	});

    //focus floor two north
    $("#floor_two_north").click(function(e){
		if(isClickable){
			if(focusFloorTwoNorth){
				//get mouse position relative to floor two north
				var x_position = 1.4 * (e.pageX - ($("#floor_two_north").position().left + $("#floor_two").position().left));
				var y_position = 1.4 * (e.pageY - ($("#floor_two_north").position().top + $("#floor_two").position().top));

				var pc_found = checkIfClickOnComputer(floor_two_north_computers, floor_two_north_computer_locations, x_position, y_position, e.pageX, e.pageY, "PC");
				
				if(showStudyRooms)
					var studyroom_found = checkIfClickOnStudyRoom(floor_two_north_studyroom, floor_two_north_studyroom_location, (distanceUnit * 1.2), distanceUnit, x_position, y_position, e.pageX, e.pageY);
				
				if(!pc_found && !studyroom_found && popup_is_visible){
					$("#popup").fadeOut();
					popup_is_visible = false;
				}
				
				//zoom out
				else if(!pc_found && !studyroom_found && !popup_is_visible){
					deFocusFloorTwoThreeAnimate("#floor_two_north", "#floor_two_north_walkway", "#floor_two", "#floor_two_tab", "#detailed_floor_two_tab", "#floor_two_south", "#floor_two_south_walkway", "#floor_one", "#floor_three");
					focusFloorTwoNorth = false;
					toggleValues();
				}
			}else{
				var pcs = floor_two_north_computers.available + " / " + floor_two_north_computers.total + " PCs";
				focusFloorTwoThreeAnimate(	"#floor_two_north", "#floor_two_north_walkway", "#floor_two", "2nd Floor", "#floor_three", "#floor_two_south", "#floor_two_south_walkway", "(North)", pcs, "#floor_two_tab", 
														"#detailed_floor_two_tab .floor_header", "#detailed_floor_two_tab .floor_sub_header", "#detailed_floor_two_tab .showPCs_text", "#detailed_floor_two_tab", false, false);		
				focusFloorTwoNorth = true;
				toggleValues();
			}
		}
    });

    //focus floor two south
    $("#floor_two_south").click(function(e){
		if(isClickable){
			if(focusFloorTwoSouth){
				//get mouse position relative to floor two south
				var x_position = 1.4 * (e.pageX - ($("#floor_two_south").position().left + $("#floor_two").position().left));
				var y_position = 1.4 * (e.pageY - ($("#floor_two_south").position().top + $("#floor_two").position().top));
				
				var pc_found = checkIfClickOnComputer(floor_two_south_computers, floor_two_south_computer_locations, x_position, y_position, e.pageX, e.pageY, "PC");
				
				if(showStudyRooms)
					var studyroom_found = checkIfClickOnStudyRoom(floor_two_south_studyroom, floor_two_south_studyroom_location, (distanceUnit / 2), (distanceUnit / 2), x_position, y_position, e.pageX, e.pageY);
				
				if(!pc_found && !studyroom_found && popup_is_visible){
					$("#popup").fadeOut();
					popup_is_visible = false;
				}
				
				//zoom out
				else if(!pc_found && !studyroom_found && !popup_is_visible){
					deFocusFloorTwoThreeAnimate("#floor_two_south", "#floor_two_south_walkway", "#floor_two", "#floor_two_tab", "#detailed_floor_two_tab", "#floor_two_north", "#floor_two_north_walkway", "#floor_one", "#floor_three");
					focusFloorTwoSouth = false;
					toggleValues();
				}
			}else{
				var pcs = floor_two_south_computers.available + " / " + floor_two_south_computers.total + " PCs";
				focusFloorTwoThreeAnimate(	"#floor_two_south", "#floor_two_south_walkway", "#floor_two", "2nd Floor", "#floor_three", "#floor_two_north", "#floor_two_north_walkway", "(South)", pcs, "#floor_two_tab", 
														"#detailed_floor_two_tab .floor_header", "#detailed_floor_two_tab .floor_sub_header", "#detailed_floor_two_tab .showPCs_text", "#detailed_floor_two_tab", false, true);
				focusFloorTwoSouth = true;		
				toggleValues();
			}
		}
    });

    //focus floor three north
    $("#floor_three_north").click(function(e){
		if(isClickable){
			if(focusFloorThreeNorth){
				//get mouse position relative to floor three north
				var x_position = 1.4 * (e.pageX - ($("#floor_three_north").position().left + $("#floor_three").position().left));
				var y_position = 1.4 * (e.pageY - ($("#floor_three_north").position().top + $("#floor_three").position().top));
				
				var pc_found = checkIfClickOnComputer(floor_three_north_computers, floor_three_north_computer_locations, x_position, y_position, e.pageX, e.pageY, "PC");
				
				if(showStudyRooms)
					var studyroom_found = checkIfClickOnStudyRoom(floor_three_north_studyroom, floor_three_north_studyroom_location, distanceUnitTwo, (distanceUnit * 0.9), x_position, y_position, e.pageX, e.pageY);
				
				if(!pc_found && !studyroom_found && popup_is_visible){
					$("#popup").fadeOut();
					popup_is_visible = false;
				}
				
				//zoom out
				else if(!pc_found && !studyroom_found && !popup_is_visible){
					deFocusFloorTwoThreeAnimate("#floor_three_north", "#floor_three_north_walkway", "#floor_three", "#floor_three_tab", "#detailed_floor_three_tab", "#floor_three_south", "#floor_three_south_walkway", "#floor_one", "#floor_two");
					focusFloorThreeNorth = false;
					toggleValues();
				}
			}else{
				var pcs = floor_three_north_computers.available + " / " + floor_three_north_computers.total + " PCs";
				focusFloorTwoThreeAnimate(	"#floor_three_north", "#floor_three_north_walkway", "#floor_three", "3rd Floor", "#floor_two", "#floor_three_south", "#floor_three_south_walkway", "(North)", pcs, "#floor_three_tab", 
														"#detailed_floor_three_tab .floor_header", "#detailed_floor_three_tab .floor_sub_header", "#detailed_floor_three_tab .showPCs_text", "#detailed_floor_three_tab", false, false);
				focusFloorThreeNorth = true;
				toggleValues();
			}
		}
    });

    //focus floor three south
    $("#floor_three_south").click(function(e){
		if(isClickable){
			if(focusFloorThreeSouth){
				//get mouse position relative to floor two south
				var x_position = 1.4 * (e.pageX - ($("#floor_three_south").position().left + $("#floor_three").position().left));
				var y_position = 1.4 * (e.pageY - ($("#floor_three_south").position().top + $("#floor_three").position().top));
				
				var pc_found = checkIfClickOnComputer(floor_three_south_computers, floor_three_south_computer_locations, x_position, y_position, e.pageX, e.pageY, "PC");
				var printer_found = checkIfClickOnPrinter(floor_three_south_printer_location, x_position, y_position, e.pageX, e.pageY, "Printer");
				
				if(!pc_found && !printer_found && popup_is_visible){
					$("#popup").fadeOut();
					popup_is_visible = false;
				}
				
				//zoom out
				else if(!pc_found && !printer_found && !popup_is_visible){
					deFocusFloorTwoThreeAnimate("#floor_three_south", "#floor_three_south_walkway", "#floor_three", "#floor_three_tab", "#detailed_floor_three_tab", "#floor_three_north", "#floor_three_north_walkway", "#floor_one", "#floor_two");
					focusFloorThreeSouth = false;
					toggleValues();
				}
			}else{
				var pcs = floor_three_south_computers.available + " / " + floor_three_south_computers.total + " PCs";
				focusFloorTwoThreeAnimate(	"#floor_three_south", "#floor_three_south_walkway", "#floor_three", "3rd Floor", "#floor_two", "#floor_three_north", "#floor_three_north_walkway", "(South)", pcs, "#floor_three_tab", 
														"#detailed_floor_three_tab .floor_header", "#detailed_floor_three_tab .floor_sub_header", "#detailed_floor_three_tab .showPCs_text", "#detailed_floor_three_tab", true, true);
				focusFloorThreeSouth = true;
				toggleValues();
			}
		}
    });

}