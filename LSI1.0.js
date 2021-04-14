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
        TemperatureK = Temperature + 273
    } else {
        TemperatureK = (Temperature - 32) * 5 / 9 + 273.15
        console.log(Temperature + "F is " + TemperatureK + "K")
    }

    if (document.getElementById("KHPicker").value == "ppm") {
        KH_ppm = KH
    } else {
        KH_ppm = KH * 17.848
        console.log(KH + "dH is " + KH_ppm + "ppm")
    }

    if (document.getElementById("GHPicker").value == "ppm") {
        GH_ppm = GH
    } else {
        GH_ppm = GH * 17.848
        console.log(GH + "dH is " + GH_ppm + "ppm")
    }


    // Error collection
    if (TDS <= 0 || pH <= 0 || pH > 14 || KH_ppm <= 0 || GH_ppm <= 0 || Temperature == 0) {
        document.getElementById("ErrorMsg").innerHTML = "Please check your inputs and try again";
        return;
    } else if (KH_ppm > 300 || GH_ppm > 300) {
        document.getElementById("ErrorMsg").innerHTML = "Your KH/GH results are very high. Make sure that you have selected the correct unit";
    } else {
        document.getElementById("ErrorMsg").innerHTML = "";
    }

    // Calculations
    var TDSFactor = (Math.log10(TDS) - 1) / 10;
    var alkalinityFactor = Math.log10(KH_ppm);
    var calciumFactor = Math.log10(GH_ppm) - 0.4;

    var tempFactor_Custom = (-13.12 * Math.log10(TemperatureK)) + 34.55;
    var pHs_Custom = (9.3 + TDSFactor + tempFactor_Custom) - (calciumFactor + alkalinityFactor);
    var LSI_Custom = { number: pH - pHs_Custom }

    var tempFactor_95 = (-13.12 * Math.log10(95 + 273)) + 34.55;
    var pHs_95 = (9.3 + TDSFactor + tempFactor_95) - (calciumFactor + alkalinityFactor);
    var LSI_95 = { number: pH - pHs_95 }

    var tempFactor_125 = (-13.12 * Math.log10(125 + 273)) + 34.55;
    var pHs_125 = (9.3 + TDSFactor + tempFactor_125) - (calciumFactor + alkalinityFactor);
    var LSI_125 = { number: pH - pHs_125 }



    // Text results

    textResults(LSI_Custom);
    textResults(LSI_95);
    textResults(LSI_125);

    function textResults(result) {

        if (result.number < -2) {
            result.text = VCorrosive;
            result.style = "color: #d35d6d;"
        } else if (result.number < -0.5) {
            result.text = Corrosive;
            result.style = "color: #d35d6d;"
        } else if (result.number < 0) {
            result.text = SlightCorrosive;
            result.style = ""
        } else if (result.number < 0.5) {
            result.text = Balanced;
            result.style = ""
        } else if (result.number < 1) {
            result.text = SlightScaly;
            result.style = ""
        } else if (result.number < 2) {
            result.text = Scaly;
            result.style = "color: #d35d6d;"
        } else {
            result.text = VScaly;
            result.style = "color: #d35d6d;"
        }

    }




    // Tweak units

    if (document.getElementById("TempPicker").value == "C") {
        document.getElementById("TempUnit").innerHTML = "C"
    } else {
        document.getElementById("TempUnit").innerHTML = "F"
    }


    // Display results
    document.getElementById("CustomTemp").innerHTML = Temperature
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




function hideResults() {
    document.querySelectorAll(".Output").forEach(hide);
}

function hide(element) {

    element.classList.add("hidden");
}

function showResults() {
    document.querySelectorAll(".Output").forEach(show);
}

function show(element) {

    element.classList.remove("hidden");
}