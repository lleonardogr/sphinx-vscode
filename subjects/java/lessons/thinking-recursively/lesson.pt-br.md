## Em resumo

Um método **recursivo** chama a si mesmo numa versão menor do problema. Ele precisa de um **caso base**, pequeno o bastante para responder direto, e toda chamada tem que chegar mais perto dele.

```java
String binary(int n) {
    if (n < 2) {
        return String.valueOf(n);  // caso base: 0 ou 1
    }
    return binary(n / 2) + n % 2;  // um problema menor, depois mais um dígito
}

void main() {
    int n = Integer.parseInt(IO.readln());
    IO.println(n + " em binário é " + binary(n));
}
```

`binary(13)` chama `binary(6)`, que chama `binary(3)`, depois `binary(1)`: o caso base devolve `"1"`, e cada chamada acrescenta seu dígito na volta: `1101`.

**Cuidado:** sem caso base, ou com chamadas que nunca chegam a ele, o método chama a si mesmo até o programa parar com um `StackOverflowError`.

<!-- readings -->
