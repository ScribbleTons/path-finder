import {
  LegacyRef,
  MutableRefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import reactLogo from './assets/react.svg';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import AppContainer from './components/AppContainer';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';

const lng = -0.1275;
const lat = 51.5072;

const center = { lat, lng };
const libraries: ['places'] = ['places'];

function App() {
  const [map, setMap] = useState<google.maps.Map>({} as google.maps.Map);
  const [directionsResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult>();
  const [distance, setDistance] = useState<string>();
  const [estDuration, setEstDuration] = useState<string>();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const originRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);

  const calculateRoute = async () => {
    if (!originRef.current?.value || !destRef.current?.value) {
      return;
    }

    const dirService = new google.maps.DirectionsService();
    const results = await dirService.route({
      origin: originRef.current.value,
      destination: destRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionResponse(results);
    setDistance(results.routes[0].legs[0].distance?.text);
    setEstDuration(results.routes[0].legs[0].duration?.text);
    map.setZoom(10);
  };

  const clearRoute = () => {
    setDirectionResponse(undefined);
    setDistance('');
    setEstDuration('');
    // @ts-ignore
    originRef.current.value = '';
    // @ts-ignore
    destRef.current.value = '';
    map.panTo(center);
    map.setZoom(15);
  };

  const Aside = () => {
    return (
      <>
        <Heading as='h2' fontSize={24}>
          Create a new Journey
        </Heading>
        <FormControl>
          <FormLabel>Origin</FormLabel>
          <Autocomplete>
            <Input type='text' ref={originRef} />
          </Autocomplete>
          <FormHelperText>e.g New York, NY</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Destination</FormLabel>
          <Autocomplete>
            <Input type='text' ref={destRef} />
          </Autocomplete>
          <FormHelperText>e.g California, CA</FormHelperText>
        </FormControl>
        <Spacer justifyContent='space-between' w='1' gap={[8, 8]} flex={0}>
          <Button variant='solid' colorScheme='purple' onClick={calculateRoute}>
            Calculate Route
          </Button>
          <Button
            mt={15}
            variant='ghost'
            colorScheme='purple'
            onClick={clearRoute}
          >
            Clear
          </Button>
        </Spacer>

        <VStack w='100%'>
          <Text w='100%' fontWeight='bold'>
            Trip Details
          </Text>
          <Box w='100%'>
            <Text>
              Distance: <em>{'  ' + distance ?? 'unavailable'}</em>
            </Text>
            <Text>
              Est. Duration: <em>{'  ' + estDuration ?? 'unavailable'}</em>
            </Text>
          </Box>
        </VStack>
      </>
    );
  };

  if (!isLoaded) {
    return <Spinner />;
  }

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap({} as google.maps.Map);
  };

  return (
    <AppContainer aside={<Aside />}>
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: false,
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={center} title='Center' />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
    </AppContainer>
  );
}

export default App;
