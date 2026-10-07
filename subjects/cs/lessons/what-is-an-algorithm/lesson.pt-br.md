## Por que isso importa

Todo programa que você escreve segue um plano: ler a entrada, fazer alguns passos, imprimir a resposta. Esse plano é um **algoritmo**. Dois programas podem dar a mesma resposta enquanto um leva um segundo e o outro um dia, e a diferença quase sempre está no algoritmo, não no computador.

## Algoritmos são receitas precisas

Um algoritmo é uma **lista finita de passos precisos** que resolve um problema. Uma receita chega perto: "bata 3 ovos, acrescente 200 g de farinha, asse por 30 minutos". Para ser um algoritmo, ela precisa:

- ser **precisa**: cada passo tem exatamente um significado, para que um computador possa segui-lo;
- **terminar**: não pode rodar para sempre;
- ser **correta**: dá a resposta certa para toda entrada válida, não só para os exemplos.

O mesmo problema normalmente tem muitos algoritmos, e alguns são muito mais rápidos que outros.

## Exemplo: achar um número numa lista

Suponha que você precise saber se o 37 está numa lista de 1.000 números.

A **busca linear** olha os números um por um, a partir do primeiro. Se o 37 estiver perto do começo, é rápida, mas se ele for o último, ou nem estiver lá, ela olha os 1.000 números.

A **busca binária** precisa que a lista esteja **ordenada**, mas aí é muito mais rápida. Olhe o número do meio:

1. Se for 37, acabou.
2. Se for maior que 37, o 37 só pode estar na primeira metade: jogue a segunda metade fora.
3. Se for menor, jogue a primeira metade fora.
4. Repita com a metade que sobrou.

Cada passo divide ao meio o que sobra: 1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1. Então a busca binária precisa de **no máximo 10 passos** para 1.000 números, e só 20 para um milhão. É o jogo de "adivinhe o número" jogado direito: para adivinhar um número de 1 a 100, chute sempre o meio, e você nunca vai precisar de mais de 7 chutes.

| Números na lista | Busca linear (pior caso) | Busca binária (pior caso) |
|------------------|--------------------------|---------------------------|
| 10 | 10 | 4 |
| 1.000 | 1.000 | 10 |
| 1.000.000 | 1.000.000 | 20 |

## Exemplo: ordenação

Ordenar é tão comum que existem dezenas de algoritmos. A **ordenação por seleção** é simples: ache o menor número e troque-o para a frente; depois ache o menor do resto e troque-o para o segundo lugar; e assim por diante. Cada passada olha todos os números que sobraram, então uma lista de n números precisa de cerca de n²/2 comparações. Algoritmos mais rápidos, como o merge sort e o que está dentro do `Arrays.sort` do Java, precisam só de cerca de n × log₂ n.

Para 1.000 números, são cerca de 500.000 comparações contra cerca de 10.000.

## Como pensar num algoritmo

1. **Entenda o problema**: qual é a entrada, qual é a saída, quais são os casos de borda (lista vazia, um elemento, não encontrado)?
2. **Ache primeiro uma solução simples e correta**, mesmo que lenta.
3. **Conte o trabalho** que ela faz conforme a entrada cresce.
4. **Procure uma ideia melhor** quando a entrada pode ser grande: ordenar antes, dividir ao meio, ou lembrar resultados que você já calculou.

## Resumo

- Um algoritmo é uma lista finita de passos precisos que resolve um problema corretamente.
- A busca linear verifica cada elemento; a busca binária divide ao meio uma lista ordenada a cada passo.
- A ordenação por seleção precisa de cerca de n²/2 comparações; bons algoritmos de ordenação precisam de cerca de n log₂ n.
- Comece com uma solução simples e correta, depois conte o trabalho dela e melhore.
