Module.register("MMM-Photovoltaik", {
    // Default module config.
    defaults: {},

    start: function () {
        this.dataFile = "modules/MMM-Photovoltaik/aktuellMM.txt";  //Name der Lokalen Datei

        // Variablen zum Speichern der einzelnen Werte
        this.Aktuell = "";
        this.Abweichung = "";
        this.Heute = "";
        this.Heute_Peak = "";
        this.Monat = "";
        this.Monat_Prozent = "";
        this.Jahr = "";
        this.Jahr_Prozent = "";
		this.Zeitstempel = "";

        this.loadValues();
        var self = this;
        setInterval(function () {
            self.loadValues();
        }, 60000);
    },

    loadValues: function () {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.dataFile + "?t=" + new Date().getTime(), true); // Cache-Busting
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                self.processValues(xhr.responseText);
            }
        };
        xhr.send();
    },

    processValues: function (data) {
        var valuesArray = data.split(";");

        if (valuesArray.length < 8) return;

        this.Aktuell = valuesArray[0] + " kW";
        this.Abweichung = valuesArray[1] + " kW";
        this.Heute = valuesArray[2] + " kWh";
        this.Heute_Peak = valuesArray[3] + " kW";
        this.Monat = valuesArray[4] + " kWh";
        this.Monat_Prozent = valuesArray[5] + " %";
        this.Jahr = valuesArray[6] + " kWh";
        this.Jahr_Prozent = valuesArray[7] + " %";
		this.Zeitstempel = valuesArray[8] ;
		
			

        this.updateDom();
    },

    getDom: function () {
        var wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <i class="fa-solid fa-solar-panel"></i> <strong> ${this.Aktuell} &ensp; <i class="fa-solid fa-bolt"></i> ${this.Heute_Peak} </strong><br>
            <i class="fa-solid fa-calendar-day"></i><strong> ${this.Heute} </strong> &ensp; <i class="fa-solid fa-scale-unbalanced"></i> ${this.Abweichung}<br>
            <i class="fa-solid fa-calendar-days"></i> <strong> ${this.Monat} </strong> &ensp; ${this.Monat_Prozent}<br>
            <i class="fa-solid fa-calendar-check"></i>️ <strong> ${this.Jahr} </strong> &ensp; ${this.Jahr_Prozent}<br>
			<span style="font-size: 0.8em;">
			<i class="fa-regular fa-clock"></i>️ <em> ${this.Zeitstempel} </em> 
			</span>
        `;

        return wrapper;
    }
});
