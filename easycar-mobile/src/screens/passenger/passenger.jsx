import { Text, View, TextInput, ActivityIndicator } from "react-native";
import MyButton from "../../components/mybutton/mybutton.jsx";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";
import { styles } from "./passenger.style.js";
import { useState, useEffect, Alert } from "react";
import icons from "../../constants/icons";

import { getCurrentPositionAsync, 
         requestForegroundPermissionsAsync, 
         reverseGeocodeAsync } from "expo-location";

function Passenger(props) {

  const userId = 1;
  const [myLocation, setMyLocation] = useState({ });
  const [title, setTitle] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [status, setStatus] = useState("");
  const [rideId, setRideId] = useState(0);
  const [driverName, setDriverName] = useState("");

  // Função assíncrona para buscar os dados da corrida do usuário na API
  async function RequestRideFromUser() {

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

  const response = {
    ride_id: 1,
    passenger_user_id: 1,
    passenger_name: "Heber Stein Mazutti",
    passenger_phone: "(11) 99999-9999",
    pickup_address: "Praça Charles Miller - Pacaembu",
    pickup_date: "2025-02-19",
    pickup_latitude: "-23.543132",
    pickup_longitude: "-46.665389",
    dropoff_address: "Shopping Center Norte",
    status: "A",
    driver_user_id: 2,
    driver_name: "João Martins",
    driver_phone: "(11) 5555-5555"
}

    return response;
  }

  // Função assíncrona para solicitar permissão de localização e obter coordenadas
  async function RequestPermissionAndGetLocation() {
    const { granted } = await requestForegroundPermissionsAsync(); // Verifica se o usuário concedeu permissão
    
    if (granted) {
      const currentPosition = await getCurrentPositionAsync(); // Obtém a posição atual
      
      if (currentPosition.coords) 
        return currentPosition.coords;
      else 
        return {};
    } else {
      return {}; // Retorna um objeto vazio caso a permissão não seja concedida
    }
  }

  // Função assíncrona para obter o nome do endereço com base na latitude e longitude
  async function ResquestAdressName(latitude, longitude) {
    const response = await reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude
    });

    if (response[0].street && response[0].streetNumber && response[0].district) {
      setPickupAddress(response[0].street + ", " + response[0].streetNumber + " - " + response[0].district);
    }
  }

  // Função que carrega a tela, buscando a corrida do usuário e sua localização
  async function LoadScreen() {
    // Buscar dados de corrida aberta na API para o usuário
    const response = await RequestRideFromUser();

    if (!response.ride_id) {
      // Se não houver corrida aberta, solicita a localização do usuário
      const location = await RequestPermissionAndGetLocation();

      if (location.latitude) {
        setTitle("Encontre sua carona agora");
        setMyLocation(location);   

        // Buscar o nome da rua através das coordenadas
        ResquestAdressName(location.latitude, location.longitude);
      } else {
        Alert.alert("Não foi possível obter sua localização");
      }
    } else {
      // Se houver corrida aberta, navega para a tela de detalhes da corrida
      setTitle(response.status == "P" ? "Aguardando uma carona" : "Encontre sua carona agora");
      setMyLocation({
        latitude: Number(response.pickup_latitude), 
        longitude: Number(response.pickup_longitude)
      });   
    //Ajustar nome de origem e destino
    setPickupAddress(response.pickup_address);
    setDropoffAddress(response.dropoff_address);
    setStatus(response.status);
    setRideId(response.ride_id);
    setDriverName(response.driver_name + " - " + response.driver_phone);
    }
  }

  // Função para solicitar uma nova corridaa
  async function AskForRide() {
    const json = { 
      passenger_id: userId,
      pickup_address: pickupAddress,
      dropoff_address: dropoffAddress,
      pickup_latitude: myLocation.latitude,
      pickup_longitude: myLocation.longitude
    };

    console.log("Fazer POST para o servidor: ",json);
    props.navigation.goBack();
  }

  async function CancelRide() {
    const json = {
      passenger_user_id: userId,
      ride_id: rideId
    }
    console.log("Cancelar Carona: ",json);
    props.navigation.goBack();
  }

  async function FinishRide(){
    const json = {
      passenger_user_id: userId,
      ride_id: rideId
    }
    console.log("Finalizar Carona: ",json);
    props.navigation.goBack();
  }

  // useEffect para carregar a tela quando o componente for montado
  useEffect(() => {
    LoadScreen();
  }, []);

  return (
    <View style={styles.container}>
      {myLocation.latitude ? (
        <>
          {/* Mapa exibindo a localização do usuário */}
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
            {/* Marcador da posição atual do usuário */}
            <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              title="Ary Gilberto Lindenberg Girão"
              description="Residência do Leo e da Karina"
              image={icons.location}
              style={styles.marker}
            />
          </MapView>

          {/* Rodapé com informações de origem e destino */}
          <View style={styles.footer}>
            <View style={styles.footerText}>
              <Text style={styles.text}>{title}</Text>
            </View>

            <View style={styles.footerFields}>
              <Text style={styles.text}>Origem</Text>
              <TextInput placeholder="" style={styles.input} value={pickupAddress} 
              onChangeText={(text) => setPickupAddress(text)}
              editable={status == "" ? true : false}/>
            </View>

            <View style={styles.footerFields}>
              <Text style={styles.text}>Destino</Text>
              <TextInput placeholder="" style={styles.input} value={dropoffAddress} 
              onChangeText={(text) => setDropoffAddress(text)}
              editable={status == "" ? true : false}/>
            </View>

            {
              status == "A" &&
              <View style={styles.footerFields}>
                <Text style={styles.text}>Motorista</Text>
                <TextInput placeholder="" style={styles.input} value={driverName} 
                editable={false}/>
              </View>
            }  


          </View>        
          {status == "" && <MyButton text="Confirmar" theme="default" onClick={AskForRide}/>}     
          {status == "P" && <MyButton text="Cancelar" theme="red" onClick={CancelRide}/>}
          {status == "A" && <MyButton text="Finalizar Carona" theme="red" onClick={FinishRide}/>}
          
        </>
      ) : (
        /* Exibe um indicador de carregamento enquanto a localização está sendo obtida */
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

export default Passenger;
