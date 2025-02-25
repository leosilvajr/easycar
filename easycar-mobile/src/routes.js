import { NavigationContainer } from "@react-navigation/native" //Toda minha navegação tem que estar dentro de uma NavigationContainer
import { createNativeStackNavigator } from "@react-navigation/native-stack" //createNativeStackNavigator cria uma pilha de telas

import Home from "./screens/home/home"
import Passenger from "./screens/passenger/passenger"

const Stack = createNativeStackNavigator()

function Routes () {
    return <NavigationContainer>
        <Stack.Navigator>

            <Stack.Screen name="passenger" component={Passenger} options={{
                headerShown: false
            }}/>

            <Stack.Screen name="home" component={Home} options={{
                headerShown: false
            }}/>


        </Stack.Navigator>
    </NavigationContainer>
}

export default Routes