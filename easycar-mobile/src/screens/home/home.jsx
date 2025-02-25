import { Text } from "react-native"

function Home() {

    const nome = "Leonardo";

    return <>
        <Text style={{fontSize: 50}}>Olá, {nome}</Text>
        <Text style={{fontSize: 50}}>LogoTipo</Text>
        <Text style={{fontSize: 50}}>Passageiros</Text>
        <Text style={{fontSize: 50}}>Motorista</Text>
    </>
}

export default Home