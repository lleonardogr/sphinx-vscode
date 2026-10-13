# Hodômetro

Muitos carros e microcontroladores contam com um **contador de 16 bits**: ele guarda de 0 a 65535, e mais um passo o traz de volta ao 0, como um hodômetro antigo passando de 99999 para 00000. No C um tipo `unsigned` faz exatamente isso: a aritmética sem sinal dá a volta, por definição.

Um contador de viagem começa numa leitura e soma a distância de cada viagem. Imprima a leitura depois de cada viagem, e depois quantas vezes ele deu a volta e a distância real percorrida.

Começando em 65530, viagens de 3 e de 10:

```
Reading: 65533
Reading: 00007
Rollovers: 1
Distance: 13
```

65533 + 10 = 65543, que passa 7 de 65536: o contador mostra `00007`.

**Entrada**

- Linha 1: a leitura inicial (0 a 65535) e `n`, o número de viagens (0 ≤ n ≤ 1000)
- Depois `n` linhas com a distância de uma viagem (0 a 65535)

**Saída**

`Reading: ` e a leitura com 5 dígitos depois de cada viagem, depois `Rollovers: ` e `Distance: `.

**Coisas para saber**

- `unsigned short` tem 16 bits em todas as plataformas em que o Sphinx roda: leia com `%hu`. `uint16_t`, de `<stdint.h>`, diz 16 bits no próprio nome.
- Uma viagem tem no máximo 65535, então o contador dá no máximo uma volta por viagem.
- Isso funciona porque o contador é **sem sinal**. Estourar um `int` com sinal é comportamento indefinido no C: o programa pode fazer qualquer coisa.
