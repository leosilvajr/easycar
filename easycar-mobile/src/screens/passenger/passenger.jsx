import { Text, View, TextInput, ActivityIndicator } from "react-native";
import MyButton from "../../components/mybutton/mybutton.jsx";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";
import { styles } from "./passenger.style.js";
import { useState, useEffect, Alert } from "react";
import icons from "../../constants/icons";

import { getCurrentPositionAsync, 
         requestForegroundPermissionsAsync, 
         reverseGeocodeAsync} from "expo-location";

function Passenger(props) {
  // Variável para armazenar nossa localização
  const [myLocation, setMyLocation] = useState({ });
  const [title, setTitle] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");

  async function RequestRideFromUser(){
    //Acessa os dados da API
    const response = { }

  //   const response = {
  //     ride_id: 1,
  //     passenger_user_id: 1,
  //     passenger_name: "Heber Stein Mazutti",
  //     passenger_phone: "(11) 99999-9999",
  //     pickup_address: "Praça Charles Miller - Pacaembu",
  //     pickup_date: "2025-02-19",
  //     pickup_latitude: "-23.543132",
  //     pickup_longitude: "-46.665389",
  //     dropoff_address: "Shopping Center Norte",
  //     status: "P",
  //     driver_user_id: null,
  //     driver_name: null,
  //     driver_phone: null
  // }
    return response;

  }

  async function RequestPermissionAndGetLocation() {

    const {granted} = await requestForegroundPermissionsAsync(); //granted = acesso ao GPS 

    if (granted == true) {
        const currentPosition = await getCurrentPositionAsync();

        if (currentPosition.coords) 
          return currentPosition.coords;
        else
          return {};
      
    } else {
      return {};
    }
  }

  async function ResquestAdressName(latitude, longitude) {
    const response = await reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude
    });

    if (response[0].street && response[0].streetNumber && response[0].district)  {
      setPickupAddress(response[0].street + ", " + response[0].streetNumber + " - " + response[0].district);
    }
  }

  async function LoadScreen() {
    //Buscar dados de corrida aberta na API para o usuario
    const response = await RequestRideFromUser();


    if (!response.ride_id) {
      //Se ele nao encontrar uma corrida aberta para ele faça a requisição da localização dele

      const location = await RequestPermissionAndGetLocation();

      if (location.latitude) {
        setTitle("Encontre sua carona agora");
        setMyLocation(location);   

        //Buscar o nome da rua atraves da latitude e longitude
        ResquestAdressName(location.latitude, location.longitude);

      } else 
        Alert.alert("Não foi possivel obter sua localização");
      

    } else {

    }
  }

  useEffect(() => {
    LoadScreen();
  }, []);

  return (
    <View style={styles.container}>
      {myLocation.latitude ? <>
        <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}
      >
        <Marker
          coordinate={{
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
          }}
          title="Ary Gilberto Lindenberg Girão"
          description="Residencia do Leo e da Karina"
          image={icons.location}
          style={styles.marker}
        />
        </MapView>

        <View style={styles.footer} >

          <View style={styles.footerText}>
              <Text style={styles.text}>{title}</Text>
          </View>

          <View style={styles.footerFields}>
              <Text style={styles.text}>Origem</Text>
              <TextInput placeholder="" style={styles.input} value={pickupAddress} />
          </View>

          <View style={styles.footerFields}>
              <Text style={styles.text}>Destino</Text>
              <TextInput placeholder="" style={styles.input} value={dropoffAddress} />
          </View>

          {/* <View style={styles.footerFields}>
              <Text style={styles.text}>Motorista</Text>
              <TextInput placeholder="" style={styles.input} />
          </View> */}

        </View>

        <MyButton text="Confirmar" theme="default"/>
      </> 
      
      :
      
      <>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      </>}



    </View>
  );
}

export default Passenger;
