# Donor and Government Funded Projects In Kenya
![Kenya Map](/images/kenyamap.png)

A map written in javascript and mapbox.js showing sponsored projects in Kenya, Sorted by projects per county.

**To run locally**
You will need Node Package manager installed and then run the following:
```
npm install connect serve-static
node server.js
```
And then point a browser to `localhost:8080/index.html`

I decided to take the approach of using a single page javascript app to make visualizing the data more clear. This method could also be used to drop this map into an existing dataset with minimal modifications.

**Libraries Used:**
* jquery
* connect
* serve-static
* mapbox.js
* Leaflet MarkerCluster

And extensive help from the Mapbox.js and Leaflet.js documentation
