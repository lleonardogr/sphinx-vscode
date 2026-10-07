## Por que isso importa

Quando você abre uma página da web, os dados atravessam cidades e oceanos numa fração de segundo, passando por equipamentos de dezenas de empresas que nunca combinaram nada com você. Isso funciona porque todo dispositivo segue as mesmas regras, chamadas **protocolos**. Conhecer os principais ajuda a entender mensagens de erro, conexões lentas e o que um programa faz quando "conversa com um servidor".

## Pacotes

A internet nunca manda um arquivo de uma vez. Ela corta os dados em **pacotes** de no máximo cerca de 1500 bytes. Cada pacote tem:

- um **cabeçalho**: de onde ele vem, para onde vai e a posição dele na sequência;
- uma **carga útil**: um pedaço dos dados.

Os pacotes viajam de forma independente, podem seguir caminhos diferentes e até chegar fora de ordem. Quem recebe os junta de novo. Se um se perde, só aquele pacote precisa ser reenviado, não o arquivo inteiro.

## Endereços IP e roteadores

Todo dispositivo numa rede tem um **endereço IP**, como `142.250.79.46`. O **Internet Protocol (IP)** leva cada pacote do endereço de quem envia até o endereço de quem recebe.

No caminho, os pacotes passam por **roteadores**. Um roteador não conhece o caminho inteiro: ele só sabe qual vizinho está mais perto do destino e encaminha o pacote para lá. Depois de 10 a 20 desses saltos, o pacote chega. Se uma rota quebra, os roteadores acham outra.

## TCP e UDP

O IP sozinho não promete que os pacotes chegam, nem que chegam em ordem. Dois protocolos por cima dele dão garantias diferentes:

| | TCP | UDP |
|---|-----|-----|
| Entrega | garantida: pacotes perdidos são reenviados | não garantida |
| Ordem | os dados chegam em ordem | os pacotes podem chegar em qualquer ordem |
| Velocidade | um pouco mais lento (espera confirmações) | mais rápido |
| Usado para | páginas da web, e-mail, downloads | chamadas de vídeo, jogos, transmissões ao vivo |

Num arquivo, todo byte precisa chegar. Numa chamada de vídeo, um pacote atrasado não serve para nada, então a velocidade importa mais que a perfeição.

## Portas

Um computador roda muitos programas que usam a rede ao mesmo tempo. Um **número de porta** diz para qual programa o pacote é. Algumas portas conhecidas: **80** para HTTP, **443** para HTTPS, **25** para e-mail entre servidores. Um endereço mais uma porta, como `142.250.79.46:443`, identifica um serviço.

## DNS: de nomes para endereços

As pessoas lembram de `www.google.com`, não de `142.250.79.46`. O **Domain Name System (DNS)** é a lista telefônica da internet: antes de conectar, seu computador pergunta a um servidor DNS qual é o endereço do nome. Se o DNS falha, os sites parecem "fora do ar" mesmo com a rede funcionando.

## Juntando tudo: abrindo uma página

1. Seu navegador pergunta ao DNS o endereço de `example.com`.
2. Ele abre uma conexão TCP com esse endereço na porta 443.
3. Ele manda um pedido HTTPS: "me dê a página `/`".
4. A resposta do servidor é dividida em pacotes, encaminhada salto a salto e remontada pelo TCP na ordem certa.
5. O navegador desenha a página e repete os passos para cada imagem e script de que precisa.

## Resumo

- Os dados viajam em pacotes com cabeçalho e carga útil, e são remontados no destino.
- Endereços IP identificam dispositivos; roteadores encaminham os pacotes salto a salto.
- O TCP garante entrega e ordem; o UDP é mais rápido, sem essas garantias.
- Portas identificam programas (443 para HTTPS); o DNS transforma nomes em endereços IP.
