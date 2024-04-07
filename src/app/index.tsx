import { Input } from "@/components/input";
import { View, Image, StatusBar, Text, Alert} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { Link } from "expo-router";
import { useState } from "react";
import { api } from "@/server/api";
import { useBadgeStore } from "@/store/badge-store";
import { Redirect } from "expo-router";

export default function Home() {
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const badgeStore = useBadgeStore()
   
    async function handleAccessCredential(){
     try {
         if(!code.trim()){
           return Alert.alert("Ingresso","Informe o código do ingresso.")
         }
         setIsLoading(true)
         const { data } = await api.get(`/attendees/${code}/badge`)
         badgeStore.save(data.badge)
     } catch (error) {
        console.log(error)
        Alert.alert("Ingresso","Ingresso não encontrado.");
        setIsLoading(false)
     }
    }

    if(badgeStore.data?.checkInURL){
        return <Redirect href="/ticket"/>
    }
    return (
        <View className="flex-1 bg-green-500 items-center justify-center p-8">
            <StatusBar barStyle="light-content"/>
            <Image 
                source={require("@/assets/logo.png")} 
                className="h-16" 
                resizeMode="contain"
            />
            <View className="w-full mt-12 gap-3">
                <Input>
                    <MaterialCommunityIcons 
                        name="ticket-confirmation-outline"
                        color={colors.green[200]}
                        size={20}
                    />
                    <Input.Field 
                        placeholder="Código do Ingresso" 
                        onChangeText={setCode}
                       
                    />
                </Input>
                <Button title="Acessar credencial" onPress={handleAccessCredential} isLoading={isLoading}/>
                <Link href="/register" className="text-gray-100 font-bold text-center mt-8"> 
                    Ainda não possui ingresso?
                </Link>
            </View>
        </View>
    );
}