//global variables

var BaseWaterSpecs = [
    {
        "name": "Distilled Water",
        "GH": 0,
        "KH": 0
    },
    {
        "name": "Acqua Panna",
        "GH": 104,
        "KH": 82
    },{
        "name": "Ashbeck (UK)",
        "GH": 42,
        "KH": 21
    },
    {
        "name": "Aqua Pura (UK)",
        "GH": 64,
        "KH": 41
    },{
        "name": "Spa (Belgium)",
        "GH": 17,
        "KH": 12
    },{
        "name": "Volvic",
        "GH": 61.7,
        "KH": 58.2
    },{
        "name": "VOSS",
        "GH": 12,
        "KH": 16
    }
];

var TargetWaterSpecs = [
    {
        "name": "BH Recipe",
        "GH": 80.7,
        "KH": 40.1
    },
    {
        "name": "SCA Spec",
        "GH": 68.6,
        "KH": 40.1
    },
    {
        "name": "Rao",
        "GH": 75.7,
        "KH": 50.1
    },
    {
        "name": "Hendon",
        "GH": 99.9,
        "KH": 30.8
    },
    {
        "name": "Pretty Hard",
        "GH": 126.1,
        "KH": 35.1
    }
];

//Initialise
window.onload = function () {
    
    var tabs = document.querySelectorAll(".app-tab");
    tabs.forEach(element => {
        element.addEventListener("click",switchTab)
    });

    var inputs = document.querySelectorAll(".app-form-input");
    inputs.forEach(element => {
        element.setAttribute("step", "any");
        element.addEventListener("change",hideResults);
    });

    var pickers = document.querySelectorAll(".app-form-unit-selector");
    pickers.forEach(element => {
        element.addEventListener("change",hideResults);
    });

    var LSIsubmit = document.getElementById("app-LSI-form");
    LSIsubmit.addEventListener("submit", calculateLSI);

    var Reminsubmit = document.getElementById("app-remin-form");
    Reminsubmit.addEventListener("submit", calculateRemin);

    var Bottlesubmit = document.getElementById("app-bottle-form");
    Bottlesubmit.addEventListener("submit", calculateBottle);

    var bwi = document.querySelectorAll("base-water-input");
    bwi.forEach(element => {
        element.addEventListener("change", changeBaseWater);
    });

    var twi = document.querySelectorAll("target-water-input");
    twi.forEach(element => {
        element.addEventListener("change", changeTargetWater);
    });

    var bwp = document.getElementById("BaseWater");
    bwp.addEventListener("change", changeBaseWaterPicker);

    var twp = document.getElementById("TargetWater");
    twp.addEventListener("change", changeTargetWaterPicker);
    
    BaseWaterSpecs.forEach(addToWaterSpecsList);
    TargetWaterSpecs.forEach(addToTargetWaterList);

    function addToWaterSpecsList(water) {
        let WaterOption = document.createElement("OPTION");
        let WaterText = document.createTextNode(water.name);
        WaterOption.appendChild(WaterText);
        document.getElementById("BaseWater").appendChild(WaterOption);
    }


    function addToTargetWaterList(water) {
        let WaterOption = document.createElement("OPTION");
        let WaterText = document.createTextNode(water.name);
        WaterOption.appendChild(WaterText);
        document.getElementById("TargetWater").appendChild(WaterOption);
    }


    
    

}


// Tab switchers

function switchTab (event) {
    if (!this.classList.contains("app-current-tab")) {
        var alltabs = document.querySelectorAll(".app-tab");
        alltabs.forEach(element => {
            element.classList.remove("app-current-tab");
            element.classList.add("app-alt-tab");
        })
 
        this.classList.add("app-current-tab");
        this.classList.remove("app-alt-tab");

        var tabs = document.querySelectorAll(".app-form");
        tabs.forEach(element => {
            element.classList.add("app-hidden-form");
        })

        let thisform;

        switch (this.id) {
            case "app-bottle-tab":
                thisform = document.getElementById("app-bottle-form");
                thisform.classList.remove("app-hidden-form");
                break;
            case "app-LSI-tab":
                thisform = document.getElementById("app-LSI-form");
                thisform.classList.remove("app-hidden-form");
                break;
            case "app-remin-tab":
                thisform = document.getElementById("app-remin-form");
                thisform.classList.remove("app-hidden-form");
                break;

        }
        
      }

    

    
      event.preventDefault();
      hideResults();
}



function hideResults() {
    document.querySelectorAll(".Output").forEach(element => {
        element.classList.add("app-hidden-results");
    });

}


function showResults() {
    document.querySelectorAll(".Output").forEach(element => {
        element.classList.remove("app-hidden-results");
    });

}






//LSI calculator

function calculateLSI() {
    var TDS = Number(document.getElementById("TDS").value);
    var pH = Number(document.getElementById("pH").value);
    var KH = Number(document.getElementById("KH").value);
    var GH = Number(document.getElementById("GH").value);
    var Temperature = Number(document.getElementById("Temperature").value);
    var KH_ppm;
    var GH_ppm;
    var TemperatureK;

    var VCorrosive = "Highly corrosive — treatment required";
    var Corrosive = "Corrosive — treatment required";
    var SlightCorrosive = "Slightly corrosive but non scale-forming";
    var Balanced = "Balanced. Pitting corrosion possible";
    var SlightScaly = "Slightly scale forming and corrosive";
    var Scaly = "Scale forming — treatment required";
    var VScaly = "Highly scale forming — treatment required";

    // convert units
    if (document.getElementById("TempPicker").value == "C") {
        TemperatureK = Temperature + 273;
    } else {
        TemperatureK = (Temperature - 32) * 5 / 9 + 273.15;
        console.log(Temperature + "F is " + TemperatureK + "K");
    }

    if (document.getElementById("KHPicker").value == "ppm") {
        KH_ppm = KH;
    } else {
        KH_ppm = KH * 17.848;
        console.log(KH + "dH is " + KH_ppm + "ppm");
    }

    if (document.getElementById("GHPicker").value == "ppm") {
        GH_ppm = GH;
    } else {
        GH_ppm = GH * 17.848;
        console.log(GH + "dH is " + GH_ppm + "ppm");
    }


    // Calculations
    var TDSFactor = (Math.log10(TDS) - 1) / 10;
    var alkalinityFactor = Math.log10(KH_ppm);
    var calciumFactor = Math.log10(GH_ppm) - 0.4;

    var tempFactor_Custom = (-13.12 * Math.log10(TemperatureK)) + 34.55;
    var pHs_Custom = (9.3 + TDSFactor + tempFactor_Custom) - (calciumFactor + alkalinityFactor);
    var LSI_Custom = { number: pH - pHs_Custom };

    var tempFactor_95 = (-13.12 * Math.log10(95 + 273)) + 34.55;
    var pHs_95 = (9.3 + TDSFactor + tempFactor_95) - (calciumFactor + alkalinityFactor);
    var LSI_95 = { number: pH - pHs_95 };

    var tempFactor_125 = (-13.12 * Math.log10(125 + 273)) + 34.55;
    var pHs_125 = (9.3 + TDSFactor + tempFactor_125) - (calciumFactor + alkalinityFactor);
    var LSI_125 = { number: pH - pHs_125 };



    // Text results

    textResults(LSI_Custom);
    textResults(LSI_95);
    textResults(LSI_125);

    function textResults(result) {

        if (result.number < -2) {
            result.text = VCorrosive;
            result.style = "color: #d35d6d;";
        } else if (result.number < -0.5) {
            result.text = Corrosive;
            result.style = "color: #d35d6d;";
        } else if (result.number < 0) {
            result.text = SlightCorrosive;
            result.style = "";
        } else if (result.number < 0.5) {
            result.text = Balanced;
            result.style = "";
        } else if (result.number < 1) {
            result.text = SlightScaly;
            result.style = "";
        } else if (result.number < 2) {
            result.text = Scaly;
            result.style = "color: #d35d6d;";
        } else {
            result.text = VScaly;
            result.style = "color: #d35d6d;";
        }

    }




    // Tweak units

    if (document.getElementById("TempPicker").value == "C") {
        document.getElementById("TempUnit").innerHTML = "C";
    } else {
        document.getElementById("TempUnit").innerHTML = "F";
    }


    // Display results
    document.getElementById("CustomTemp").innerHTML = Temperature;
    document.getElementById("LSI_Custom").innerHTML = Math.round(LSI_Custom.number * 10) / 10;
    document.getElementById("LSI_95").innerHTML = Math.round(LSI_95.number * 10) / 10;
    document.getElementById("LSI_125").innerHTML = Math.round(LSI_125.number * 10) / 10;
    document.getElementById("Result_Custom").innerHTML = LSI_Custom.text;
    document.getElementById("Result_Custom").style = LSI_Custom.style;
    document.getElementById("Result_95").innerHTML = LSI_95.text;
    document.getElementById("Result_95").style = LSI_95.style;
    document.getElementById("Result_125").innerHTML = LSI_125.text;
    document.getElementById("Result_125").style = LSI_125.style;


    showResults();



}


// Remineralisation calculator

function calculateRemin() {
    var BaseGH = Number(document.getElementById("BaseGH").value);
    var BaseKH = Number(document.getElementById("BaseKH").value);
    var TargetGH = Number(document.getElementById("TargetGH").value);
    var TargetKH = Number(document.getElementById("TargetKH").value);
    var TargetVolume = Number(document.getElementById("TargetVolume").value);

    // Convert to mL
    var WaterUnits = document.getElementById("WaterUnits").value;

    if (WaterUnits == "Litres") {
        TargetVolume_mL = TargetVolume*1000;
    } else {
        TargetVolume_mL = TargetVolume*3785,41;
    }




    // Calculate
    var HardnessVolume = (TargetGH - BaseGH) * TargetVolume_mL/1000;
    var BufferVolume = (TargetKH - BaseKH) * TargetVolume_mL/1000;
    var WaterVolume = TargetVolume_mL - HardnessVolume - BufferVolume;


    //Display results

    let HV = Math.round(HardnessVolume * 10) / 10;
    let BV = Math.round(BufferVolume * 10) / 10;
    let WV = Math.round(WaterVolume * 10) / 10;

    document.getElementById("HardnessVolume").innerHTML = HV.toFixed(1) + "g";
    document.getElementById("BufferVolume").innerHTML = BV.toFixed(1) + "g";
    document.getElementById("WaterVolume").innerHTML = WV.toFixed(1) + "g";
    showResults();


}

//remineralisation update values

function changeBaseWater() {
    document.getElementById("BaseWater").value="Custom";
}

function changeTargetWater() {
    document.getElementById("TargetWater").value="Custom";
}

function changeBaseWaterPicker() {
    let SelectedWater = document.getElementById("BaseWater").value;
    
    for (let i = 0; i < BaseWaterSpecs.length; i++) {

        if (BaseWaterSpecs[i].name == SelectedWater) {
            document.getElementById("BaseKH").value = BaseWaterSpecs[i].KH;
            document.getElementById("BaseGH").value = BaseWaterSpecs[i].GH;
        }
    }

}

function changeTargetWaterPicker() {
    let SelectedWater = document.getElementById("TargetWater").value;
    
    for (let i = 0; i < TargetWaterSpecs.length; i++) {
        if (TargetWaterSpecs[i].name == SelectedWater) {
            document.getElementById("TargetKH").value = TargetWaterSpecs[i].KH;
            document.getElementById("TargetGH").value = TargetWaterSpecs[i].GH;
        }
    }
}

//Bottle calculator

function calculateBottle() {
    var Ca = Number(document.getElementById("BottleCalcium").value);
    var Mg = Number(document.getElementById("BottleMagnesium").value);
    var Bicarb = Number(document.getElementById("BottleBicarb").value);

    var GH = Ca*2.497 + Mg*4.118;
    var KH = Bicarb*0.820;

    document.getElementById("BottleHardness").innerHTML = GH.toFixed(1) + "ppm";
    document.getElementById("BottleBuffer").innerHTML = KH.toFixed(1) + "ppm";

    showResults();


}