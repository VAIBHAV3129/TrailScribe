const GPXEngine = {
    tracePoints: [],
    rawXmlBuffer: null,

    ingest: async function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.rawXmlBuffer = e.target.result;
                resolve(this.parse(this.rawXmlBuffer));
            };
            reader.onerror = () => reject(new Error("FILE_READ_ERROR"));
            reader.readAsText(file);
        });
    },

    parse: function(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const trkpts = xmlDoc.getElementsByTagName("trkpt");
        const points = [];

        for (let ptIdx = 0; ptIdx < trkpts.length; ptIdx++) {
            const pt = trkpts[ptIdx];
            const lat = parseFloat(pt.getAttribute("lat"));
            const lon = parseFloat(pt.getAttribute("lon"));
            
            const eleNode = pt.getElementsByTagName("ele")[0];
            const alt = eleNode ? parseFloat(eleNode.textContent) : 0;

            points.push([lon, lat, alt]);
        }

        this.tracePoints = new Float64Array(points.flat());
        return this.tracePoints;
    }
};
