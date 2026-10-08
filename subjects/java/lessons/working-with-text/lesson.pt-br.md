## Em resumo

Uma **String** é uma sequência de caracteres, numerados a partir de 0. `charAt(i)` dá um `char`, `length()` conta quantos são, `indexOf` acha um, e `substring(início, fim)` copia um pedaço, de `início` até `fim`, **sem incluir** o `fim`.

```java
void main() {
    String email = IO.readln().trim();
    int at = email.indexOf('@');
    String user = email.substring(0, at);
    String domain = email.substring(at + 1);
    IO.println("Usuário: " + user + " (" + user.length() + " caracteres)");
    int dots = 0;
    for (int i = 0; i < email.length(); i++) {
        if (email.charAt(i) == '.') {
            dots++;
        }
    }
    IO.println("Pontos: " + dots);
    IO.println(domain.toLowerCase().equals("gmail.com") ? "Gmail" : "Outro");
}
```

Uma String nunca muda: `toUpperCase()` devolve uma nova. Para montar texto num laço, acrescente a um `StringBuilder`.

**Cuidado:** compare textos com `a.equals(b)`, nunca `a == b`. Caracteres sozinhos (`char`, entre aspas simples) usam `==` sim.

<!-- readings -->
