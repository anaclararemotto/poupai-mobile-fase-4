

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";


export interface Transacao {
  id: string;
  valor: number;
  tipo: "receitas" | "despesas";
  banco: string;
  categoria: string;
  data: Date;
  userId: string;
}


export const salvarNovaTransacao = async (
  transacaoData: Omit<Transacao, "id" | "userId">
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  try {
    const docRef = await addDoc(collection(db, "transacoes"), {
      ...transacaoData,
      userId: user.uid,
      criadoEm: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error("Erro ao salvar a transação: ", error);
    throw error;
  }
};


export const escutarTransacoes = (
  callback: (transacoes: Transacao[]) => void,
  
  options?: {
    filter?: "receitas" | "despesas";
    limit?: number;
  }
) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Usuário não autenticado para buscar transações.");
    return () => {};
  }

  const transacoesCollection = collection(db, "transacoes");
  let q = query(
    transacoesCollection,
    where("userId", "==", user.uid),
    orderBy("data", "desc")
  );

  if (options?.filter) {
    q = query(q, where("tipo", "==", options.filter));
  }
  if (options?.limit) {
    q = query(q, limit(options.limit));
  }

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const transacoesData: Transacao[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transacoesData.push({
          id: doc.id,
          ...data,
          data: (data.data as Timestamp).toDate(),
        } as Transacao);
      });
      callback(transacoesData);
    },
    (error) => {
      console.error("ERRO no ouvinte onSnapshot:", error);
    }
  );

  return unsubscribe;
};

export const deletarTransacao = async (idDaTransacao: string) => {
  if (!idDaTransacao) throw new Error("ID da transação não fornecido.");

  try {
    const transacaoDocRef = doc(db, "transacoes", idDaTransacao);
    await deleteDoc(transacaoDocRef);
  } catch (error) {
    console.error("Erro ao deletar transação: ", error);
    throw error;
  }
};

export const atualizarTransacao = async (
  idDaTransacao: string,
  dadosParaAtualizar: Partial<Omit<Transacao, "id" | "userId">>
) => {
  if (!idDaTransacao) throw new Error("ID da transação não fornecido.");
  const transacaoDocRef = doc(db, "transacoes", idDaTransacao);
  try {
    await updateDoc(transacaoDocRef, dadosParaAtualizar);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw error;
  }
};
