import { Text, View, TextInput } from "react-native";
import MyButton from "../../components/mybutton/mybutton.jsx";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";
import { styles } from "./passenger.styles.js";
import { useState } from "react";
import icons from "../../constants/icons";

function Passenger(props) {
  // Variável para armazenar nossa localização
  const [myLocation, setMyLocation] = useState({
    // Só consigo setar a variável myLocation com a função setMyLocation
    latitude: 2,
    longitude: 20,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: -20.612668,
          longitude: -49.655839,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}
      >
        <Marker
          coordinate={{
            latitude: -20.612668,
            longitude: -49.655839,
          }}
          title="Ary Gilberto Lindenberg Girão"
          description="Residencia do Leo e da Karina"
          image={icons.location}
          style={styles.marker}
        />
      </MapView>

      <View style={styles.footer} >

        <View style={styles.footerText}>
            <Text style={styles.text}>Encontre sua carona</Text>
        </View>

        <View style={styles.footerFields}>
            <Text style={styles.text}>Origem</Text>
            <TextInput placeholder="" style={styles.input} />
        </View>

        <View style={styles.footerFields}>
            <Text style={styles.text}>Destino</Text>
            <TextInput placeholder="" style={styles.input} />
        </View>

      </View>

      <MyButton text="Confirmar"/>
    </View>
  );
}

export default Passenger;
