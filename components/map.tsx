import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const Map = ({ coords }: { coords?: [] }) => {
  console.log(coords);
  return (
    <MapContainer
      center={[40.8054, -74.0241]}
      zoom={3}
      scrollWheelZoom={false}
      style={{ height: "800px", width: "1400px" }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoiam9lZWxtYWhhbGxhd3kiLCJhIjoiY2t5cW82NzAyMGx5bDJycGVtZTh5NTVuMCJ9.4FE37LEBWayjoT2lt_9z-Q`}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
      {coords[0] &&
        coords?.map((el) => {
          return (
            <Marker
              position={[Number(el[1]), Number(el[2])]}
              draggable={true}
              animate={true}
            >
              <Popup>Hey ! I live here</Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default Map;
