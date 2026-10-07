## Por que isso importa

Todo programa que você escreve acaba virando sinais elétricos dentro de alguns chips. Você não precisa projetar hardware para programar, mas conhecer as partes principais explica perguntas do dia a dia: por que um programa é lento, por que seu trabalho some quando a energia cai, e o que "3 GHz" ou "8 núcleos" querem dizer na caixa de um notebook.

## As partes principais

| Parte | O que faz | Exemplo |
|-------|-----------|---------|
| **CPU** (processador) | executa as instruções dos programas | um chip de 3 GHz e 8 núcleos |
| **RAM** (memória principal) | guarda os programas e dados em uso agora | 16 GB |
| **Armazenamento** | guarda os arquivos com a energia desligada | um SSD de 512 GB |
| **Entrada/saída** | conversa com o mundo de fora | teclado, tela, rede, USB |

Elas são ligadas na **placa-mãe** por fios chamados **barramentos**, que levam endereços, dados e sinais de controle entre elas.

## RAM versus armazenamento

A **RAM** é rápida, mas **volátil**: perde tudo quando a energia é desligada. O **armazenamento** (SSD ou disco rígido) é bem mais lento, mas mantém o conteúdo. É por isso que um programa e seus arquivos ficam no armazenamento, mas são **carregados na RAM** para rodar, e é por isso que o trabalho não salvo se perde numa queda de energia.

## A CPU e o ciclo de busca–decodificação–execução

A CPU só entende **instruções de máquina** muito simples: carregar um número da memória, somar dois números, comparar, pular para outra instrução. Um programa é uma longa lista delas, guardada na RAM.

A CPU as executa com um único laço, repetido bilhões de vezes por segundo:

1. **Buscar**: ler a próxima instrução da memória. Um registrador chamado **contador de programa** guarda o endereço dela.
2. **Decodificar**: descobrir o que a instrução pede e de quais dados ela precisa.
3. **Executar**: fazer, usando a **ULA** (unidade lógica e aritmética) para as contas, e guardar o resultado num **registrador**, uma célula de armazenamento minúscula dentro da CPU.

Depois o contador de programa passa para a próxima instrução, a menos que a instrução tenha sido um **salto**, que é como `if` e laços são feitos nesse nível.

## O clock

A CPU trabalha no ritmo de um **clock**. Cada batida é um **ciclo**. Um clock de 3 GHz (gigahertz) bate 3 bilhões de vezes por segundo, então um ciclo dura um terço de nanossegundo. Uma instrução simples leva alguns ciclos, então o tempo de um programa depende de:

> tempo = instruções × ciclos por instrução ÷ frequência do clock

## Núcleos

As frequências de clock pararam de crescer por volta de 2005, porque clocks mais rápidos esquentavam demais os chips. Em vez disso, os processadores ganharam mais **núcleos**: várias CPUs num só chip, cada uma executando suas próprias instruções. Um processador de 8 núcleos consegue fazer 8 coisas ao mesmo tempo, mas só se o programa for escrito para dividir o trabalho; um programa simples como os seus usa um núcleo.

## Resumo

- Um computador tem uma CPU que executa instruções, RAM para o que está em uso, armazenamento que guarda os arquivos e dispositivos de entrada/saída.
- A RAM é rápida e volátil; o armazenamento é mais lento e permanente. Os programas são carregados na RAM para rodar.
- A CPU repete busca–decodificação–execução, guiada pelo contador de programa.
- Um clock de n GHz bate n bilhões de vezes por segundo; mais núcleos deixam o computador fazer várias coisas de uma vez.
