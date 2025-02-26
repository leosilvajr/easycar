import { ImageBackground, Text, Image, TouchableOpacity, Alert } from "react-native"
import icons from "../../constants/icons";
import { styles } from "./home.style";
 

function Home(props) {

    function OpenPassenger(){
        props.navigation.navigate("passenger")
    }

    function OpenRide(){
        props.navigation.navigate("ride")
    }

    return <ImageBackground source={icons.bg} resizeMode="cover" style={styles.bg}>
        <Image source={icons.logo} style={styles.logo} />

        <TouchableOpacity style={styles.btn} onPress={OpenPassenger}>
            <Image source={icons.passenger} style={styles.img} />
            <Text style={styles.tittle}>Passageiro</Text>
            <Text style={styles.text}>Encontre uma carona para você.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={OpenRide}>
            <Image source={icons.driver} style={styles.img} />
            <Text style={styles.tittle}>Motorista</Text>
            <Text style={styles.text}>Ofereça carona com seu carro.</Text>
        </TouchableOpacity>


    </ImageBackground>
}

export default Home