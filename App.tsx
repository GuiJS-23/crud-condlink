import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Sessao } from './src/api/login';
import { Botao } from './src/componentes/Botao';
import { apagarSessao, lerSessao, salvarSessao } from './src/servicos/armazenamento';
import { lerClaims, tokenExpirado } from './src/servicos/jwt';
import { TelaLogin } from './src/telas/TelaLogin';

export default function App() {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [verificando, setVerificando] = useState(true);

  // Roda UMA vez, quando o app abre: procura uma sessão guardada no cofre.
  useEffect(() => {
    async function restaurar() {
      const salva = await lerSessao();
      if (salva) {
        const anterior: Sessao = JSON.parse(salva);
        if (tokenExpirado(anterior.token)) {
          await apagarSessao();
        } else {
          setSessao(anterior);
        }
      }
      setVerificando(false);
    }
    restaurar();
  }, []);

  async function entrou(nova: Sessao) {
    await salvarSessao(JSON.stringify(nova));
    setSessao(nova);
  }

  async function sair() {
    await apagarSessao();
    setSessao(null);
  }

  if (verificando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#14A5C4" />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <StatusBar style="dark" />
      {sessao ? (
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Olá, {sessao.nome}!</Text>
          <Text style={styles.texto}>Condomínio: {sessao.idCondominio}</Text>
          <Text style={styles.texto}>
            Token vence: {new Date(lerClaims(sessao.token).exp! * 1000).toLocaleString()}
          </Text>
          <Botao rotulo="Sair" aoTocar={sair} variante="secundario" />
        </View>
      ) : (
        <TelaLogin aoEntrar={entrou} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F1B33',
    marginBottom: 8,
  },
  texto: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 12,
  },
});