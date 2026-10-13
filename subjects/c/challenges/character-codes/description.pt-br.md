# Códigos dos caracteres

Para o computador, texto são números: cada caractere é guardado como um código, e `'A'` é 65. No C isso fica à vista, porque um `char` **é** um inteiro pequeno, e o `printf` pode mostrar o mesmo valor como caractere, em decimal ou em hexadecimal.

Leia uma linha e mostre o código de cada um dos seus caracteres, e depois uma **soma de verificação** (checksum): a soma de todos os códigos, mantida em um byte (módulo 256). Somas assim detectam um caractere trocado no caminho.

Para `Hi!`:

```
'H'  72 0x48
'i' 105 0x69
'!'  33 0x21
Checksum: 0xD2
```

72 + 105 + 33 = 210, que é `D2` em hexadecimal.

**Entrada**

Uma linha de texto com caracteres ASCII (letras, dígitos, espaços e pontuação), possivelmente vazia.

**Saída**

Uma linha por caractere: o caractere entre aspas simples, seu código em decimal em 3 caracteres e seu código em hexadecimal com 2 dígitos maiúsculos depois de `0x`. Depois `Checksum: ` e a soma no mesmo formato hexadecimal.

**Coisas para saber**

- `getchar()` devolve um `int`: o próximo caractere, ou `EOF` quando a entrada acaba. Guarde num `int`, não num `char`, para o `EOF` não se confundir com um caractere.
- `%02X` imprime em hexadecimal, em maiúsculas, completando com zeros até 2 dígitos.
- A linha termina no `'\n'`, ou no `EOF` se não houver quebra de linha.
