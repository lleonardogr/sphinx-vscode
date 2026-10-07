## Por que isso importa

O processador é tão rápido que passa boa parte do tempo **esperando a memória**. Entender a hierarquia de memória explica por que o mesmo algoritmo pode rodar várias vezes mais rápido só por ler os dados em ordem. E saber o que acontece entre o seu `Main.java` e o programa rodando explica o que `javac` e `java` fazem de verdade.

## A hierarquia de memória

Não existe memória grande, rápida e barata ao mesmo tempo, então os computadores combinam vários tipos:

| Nível | Tamanho típico | Tempo de leitura | Em ciclos de CPU (3 GHz) |
|-------|----------------|------------------|--------------------------|
| Registradores | algumas centenas de bytes | 0,3 ns | 1 |
| Cache L1 | 64 KB | 1 ns | 3 |
| Cache L3 | 32 MB | 10 ns | 30 |
| RAM | 16 GB | 100 ns | 300 |
| SSD | 1 TB | 100 µs | 300.000 |
| Disco rígido | 4 TB | 10 ms | 30.000.000 |

Cada nível é maior e mais lento que o de cima. Se ler um registrador levasse 1 segundo, ler a RAM levaria 5 minutos e ler um disco rígido cerca de um ano.

## Caches

Um **cache** guarda cópias dos dados usados recentemente perto da CPU. Quando o dado de que a CPU precisa está no cache é um **acerto**; quando não está, é uma **falha**, e a CPU espera o dado vir de um nível mais lento.

Os caches funcionam porque os programas são previsíveis:

- **Localidade temporal**: um dado usado agora provavelmente será usado de novo logo (um contador de laço).
- **Localidade espacial**: o dado ao lado provavelmente será o próximo (o próximo elemento de um array). É por isso que um cache carrega um bloco inteiro de 64 bytes de cada vez.

O tempo médio por acesso é:

> média = tempo do cache + taxa de falha × tempo da memória

Com um cache de 1 ns, RAM de 100 ns e 95% de acertos: 1 + 0,05 × 100 = 6 ns, em vez de 100 ns sem cache. Percorrer um array em ordem dá quase só acertos; pular para lugares aleatórios dá muitas falhas e pode ser dez vezes mais lento.

## Do código-fonte ao programa rodando

A CPU só executa código de máquina, e cada família de processadores tem o seu. O Java resolve isso em dois passos:

1. **Compilar**: `javac Main.java` confere o seu código e o traduz para **bytecode** (`Main.class`), instruções para uma máquina imaginária, iguais em qualquer computador.
2. **Executar**: `java Main` inicia a **Máquina Virtual Java (JVM)**, que carrega o bytecode na RAM e o executa. O código que roda muito é traduzido para código de máquina de verdade do seu processador enquanto o programa roda (**JIT**, compilação just-in-time).

É por isso que o mesmo arquivo `.class` roda no Windows, no macOS e no Linux: "escreva uma vez, rode em qualquer lugar". Linguagens como C são compiladas direto para código de máquina de um tipo de processador; Python normalmente é **interpretado** por um programa que o lê linha por linha.

Quando você aperta **Run** no Sphinx, ele faz exatamente isso: compila o seu `Main.java` com o `javac` e depois o executa com o `java`, passando a entrada do teste.

## Resumo

- A memória é uma hierarquia: registradores, caches, RAM, SSD e disco, cada um maior e mais lento.
- Os caches guardam dados recentes perto da CPU; acertos são rápidos, falhas esperam a memória mais lenta.
- Tempo médio de acesso = tempo do cache + taxa de falha × tempo da memória; ler os dados em ordem ajuda.
- O `javac` compila Java para bytecode; a JVM o executa e compila o código mais usado para código de máquina.
