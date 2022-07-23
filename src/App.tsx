import { useRef, useState } from 'react';
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
import { ArrowRightIcon } from '@chakra-ui/icons';

const lng = -0.1275;
const lat = 51.5072;

const center = { lat, lng };
const libraries: ['places'] = ['places'];

function App() {
  const [map, setMap] = useState<google.maps.Map>({} as google.maps.Map);
  const [directionsResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult>();
  const [tripDetails, setTripDetails] = useState<{
    distance?: string;
    estDuration?: string;
  }>({
    distance: '',
    estDuration: '',
  });

  const [loadingBtn, setLoadingBtn] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY, // Enter your API key in .env file to use
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
      transitOptions: {
        arrivalTime: null,
        departureTime: new Date(),
      },
    });

    setDirectionResponse(results);

    setTripDetails({
      distance: results.routes[0].legs[0].distance?.text,
      estDuration: results.routes[0].legs[0].duration?.text,
    });

    map.setZoom(10);
  };

  const clearRoute = () => {
    setDirectionResponse(undefined);
    setTripDetails({
      estDuration: '',
      distance: '',
    });
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
        <Heading as='h2' fontSize={24} color='purple'>
          Find Your Path
        </Heading>
        <Text my={16} fontSize={12}>
          Whether you're looking to PathFinder as a driver or a passenger,
          listing your journey is the best way to find a match.
        </Text>
        <FormControl>
          <FormLabel>Origin</FormLabel>
          <Autocomplete>
            <Input
              type='text'
              ref={originRef}
              _focusVisible={{
                borderColor: 'purple',
                boxShadow: '0 0 0 1px purple',
              }}
            />
          </Autocomplete>
          <FormHelperText>e.g New York, NY</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Destination</FormLabel>
          <Autocomplete>
            <Input
              shadow='none'
              type='text'
              ref={destRef}
              colorScheme='purple'
              _focusVisible={{
                borderColor: 'purple',
                boxShadow: '0 0 0 1px purple',
              }}
            />
          </Autocomplete>
          <FormHelperText>e.g California, CA</FormHelperText>
        </FormControl>
        <Spacer justifyContent='space-between' w='1' gap={[8, 8]} flex={0}>
          <Button variant='solid' colorScheme='purple' onClick={calculateRoute}>
            Find Route
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
            <HStack>
              <Text>Distance:</Text>
              <em>
                {!tripDetails.distance ? 'unavailable' : tripDetails.distance}
              </em>
            </HStack>
            <HStack>
              <Text>Est. Duration:</Text>
              <em>
                {!tripDetails.estDuration
                  ? 'unavailable'
                  : tripDetails.estDuration}
              </em>
            </HStack>
          </Box>
        </VStack>
        <HStack pos='relative' bottom={-10}>
          <Button
            variant='outline'
            colorScheme='purple'
            rightIcon={<ArrowRightIcon />}
            isLoading={loadingBtn}
            loadingText='Fetching tripsters...'
            onClick={() => {
              setLoadingBtn(true);
              setTimeout(() => {
                setLoadingBtn(false);
              }, 2000);
            }}
          >
            Discover Other Tripsters like you
          </Button>
        </HStack>
      </>
    );
  };

  if (!isLoaded) {
    return (
      <VStack
        bg='purple'
        pos='relative'
        w='100%'
        h='100vh'
        justifyContent='center'
      >
        <Spinner color='white' />
      </VStack>
    );
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
