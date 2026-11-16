import { Map, MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/mapcn-marker-content";

const locations = [
  { id: 1, name: "MediQ Pharma Inc. — Marikina–Pasig Hub", lng: 121.0942, lat: 14.6184 },
  { id: 2, name: "Marikina City (Marcos Hwy Corridor)", lng: 121.1029, lat: 14.6507 },
  { id: 3, name: "Pasig City (Ortigas–C5 Health Corridor)", lng: 121.0851, lat: 14.5764 },
];

function MarkerContentDemo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-background text-foreground">
      <div className="h-[340px] w-full overflow-hidden">
        <Map theme="dark" center={[121.0942, 14.6184]} zoom={12.4}>
          {locations.map((location) => (
            <MapMarker key={location.id} longitude={location.lng} latitude={location.lat}>
              <MarkerContent>
                <div
                  data-mapcn-marker={location.name}
                  className="size-5 rounded-full border-2 border-white bg-blue-500 shadow-lg transition-transform hover:scale-110"
                />
              </MarkerContent>
              <MarkerTooltip>{location.name}</MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
      </div>
    </div>
  );
}

export default function MarkerContentDefaultDemo() {
  return <MarkerContentDemo />;
}

export { MarkerContentDefaultDemo };
