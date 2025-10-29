
import { Chip } from "@/app/components/Chip";
import { LedgerCard } from "@/app/components/LedgerCard";
import { useTheme } from "@/app/theme/ThemeContext";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { transactionsStyle } from "./transactions.styles";


import { ChipData, TransactionsModel } from "./transactions.model";

import { CardTransactions } from "@/app/components/CardTransactions";
import { Search } from "@/app/components/Search";
import { TransactionsButton } from "@/app/components/TransactionButton";


import {
  escutarTransacoes,
  Transacao,
} from '../../models/transaction.model';

export const TransactionsView = () => {
const { colors } = useTheme();
const styles = transactionsStyle(colors);


 const { chips, toggleChip } = TransactionsModel();

 const [transacoes, setTransacoes] = useState<Transacao[]>([]);


 useEffect(() => {

 const unsubscribe = escutarTransacoes((data) => {
 console.log("Dados recebidos do Firebase:", data); // Para depuração
 setTransacoes(data);
 });


 return () => unsubscribe();
 }, []); 


const totalReceitas = transacoes
 .filter((t) => t.tipo === 'receitas')
 .reduce((acc, t) => acc + t.valor, 0);

const totalDespesas = transacoes
 .filter((t) => t.tipo === 'despesas')
 .reduce((acc, t) => acc + t.valor, 0);


return (
 <View style={styles.container}>
 <View style={styles.containerInfo}>
 <View style={styles.nav}>
 <TouchableOpacity onPress={() => router.push("/Home")}>
 <ChevronLeft color={colors.white} />
 </TouchableOpacity>
 <Text style={styles.navText}>Transações</Text>
 <View />
 </View>
<View style={styles.containerLedger}>

 <LedgerCard type="income" title="Receitas" amount={`R$ ${totalReceitas.toFixed(2)}`} />
 <LedgerCard type="expense" title="Despesas" amount={`R$ ${totalDespesas.toFixed(2)}`} />
 </View>
 </View>
 <ScrollView
 style={styles.carousel}
 horizontal
 showsHorizontalScrollIndicator={false}
 >

 {chips.map((chip: ChipData) => (
 <Chip key={chip.id} data={chip} onPress={toggleChip} />
 ))}
 </ScrollView>
 <Search />
 <View>
 <ScrollView style={styles.cards} showsHorizontalScrollIndicator={false}>
 

 {transacoes.length === 0 ? (
<Text style={styles.navText}>Nenhuma transação encontrada.</Text>
 ) : (

transacoes.map((transacao) => (
 <CardTransactions 
 key={transacao.id} 


 type={transacao.tipo}
 title={transacao.categoria} 
 amount={transacao.valor} 
date={transacao.data} 
 />
 ))
 )}

 </ScrollView>
</View>
 <TransactionsButton text="Adicionar Transferencia" />
 </View>
  );
};

