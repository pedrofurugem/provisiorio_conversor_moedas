import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native'

import Picker from './src/components/Picker/index'
import api from './src/services/api'

export default function app(){
    const [moedas, setMoedas] = useState([]);
    const [loading, setLoading] = useState(true) //pra ele carrgar todas as moedas
    const [moedaSelecionada, setMoedaSelecionada] = useState(null)
    const [moedaBRValor, setMoedaBRValor] = useState(0) //moeda real brasileiro
    const [valorMoeda, setValorMoeda] = useState(null) //moeda estrangeira
    const [valorConvertido, setValorConvertido] = useState(0)

    //vamos carregar as moedas usando o useEffect
    useEffect(()=> {
        async function loadMoedas(){
            const response = await api.get('all')
            //tranformar o objeto em arrays - trazer só as keys
            //pesquisar sobre depois
            let arrayMoedas = []
            //map para percorrer os objetos
            Object.keys(response.data).map((key)=> {
                arrayMoedas.push({
                    key: key,
                    label: key,
                    value: key,
                })
            })
            setMoedas(arrayMoedas)
            setLoading(false)
        }
        loadMoedas()
    }, []);
    //verificação
    async function converter(){
        if(moedaSelecionada === null || moedaBRValor === 0){
            alert('Por favor selecione uma moeda');
            return
        }
        //aqui fazemos a requisição
        //USD-BRL ele devolve quanto é 1 dolar convertido para reais
        const response = await api.get(`all/${moedaSelecionada}-BRL`)
        //console.log(response.data[moedaSelecionada].ask) //acessando o preço de venda
        let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBRValor))
        setValorConvertido(`R$ ${resultado.toFixed(2)}`)
        setValorMoeda(moedaBRValor) //pra eu saber o valor que foi armazenado e dgitado
        //fechando teclado
        Keyboard.dismiss()
    }
    
    if(loading){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color="#FFF" size={45}/>
            </View>
        )
    }
    else{
        return(
            <View style={styles.container}>

                <View style={styles.areaMoeda}>
                    <Text style={styles.titulo}>Selecione sua moeda</Text>
                    <Picker moedas={moedas} onChange={ (moeda) => setMoedaSelecionada(moeda)}/>
                </View>

                <View style={styles.areaValor}>
                    <Text style={styles.titulo}>Digite um valor R$</Text>
                    <TextInput 
                    placeholder='Ex: 150'
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={ (valor) => setMoedaBRValor(valor)}
                    />
                </View>

                <TouchableOpacity style={styles.botaoArea} onPress={converter}>
                    <Text style={styles.botaoTexto}>Converter</Text>
                </TouchableOpacity>

                { valorConvertido !== 0 && (
                    <View style={styles.areaResultado}>
                        <Text style={styles.valorConvertido}>{valorMoeda} {moedaSelecionada}</Text>
                        <Text style={[styles.valorConvertido, { fontSize: 18, margin: 10}]}>Corresponde a</Text>
                        <Text style={styles.valorConvertioBR}>{valorConvertido}</Text>
                    </View>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#101215',
        alignItems: 'center',
        paddingTop: 40,
    },
    areaMoeda: {
        backgroundColor: '#f9f9f9',
        width: '90%',
        paddingTop: 9,
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        marginBottom: 1, //ter aquela linha
    },
    titulo: {
        color: '#000',
        fontSize: 15,
        paddingTop: 5,
        paddingLeft: 5
    },
    areaValor: {
        backgroundColor: '#f9f9f9',
        width: '90%',
        paddingBottom: 8,
        paddingTop: 9,
    },
    input: {
        width: '100%',
        padding: 10,
        height: 45,
        fontSize: 20,
        marginTop: 10,
        color: '#000'
    },
    botaoArea: {
        width: '90%',
        backgroundColor: '#FB4b57',
        height: 45,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoTexto: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
    areaResultado: {
        width: '90%',
        backgroundColor: '#FFF',
        marginTop: 35,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25
    },
    valorConvertido: {
        fontSize: 39,
        fontWeight: 'bold',
        color: '#000'
    },
    valorConvertioBR: {
        fontSize: 39,
        fontWeight: 'bold',
        color: '#32CD32'
    }
})