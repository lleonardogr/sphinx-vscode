# Notificações (classe abstrata)

Um aplicativo manda o mesmo tipo de mensagem por três canais. A parte comum, a linha que diz para onde a mensagem vai, é escrita uma vez numa **classe abstrata**; cada canal decide só como formatar o texto.

Escreva uma classe abstrata `Notification`:

- um campo `private final` com o destinatário, definido pelo construtor;
- `abstract String channel()`: `EMAIL`, `SMS` ou `PUSH`;
- `abstract String format(String text)`: como o canal formata o texto;
- `String send(String text)`, escrito **uma vez** em `Notification`, que devolve `CANAL to DESTINATÁRIO: texto formatado`.

Depois escreva três subclasses:

| Classe | channel() | format(text) |
|---|---|---|
| `Email` | `EMAIL` | o texto como está |
| `Sms` | `SMS` | o texto, se tiver no máximo 16 caracteres; senão os 13 primeiros caracteres seguidos de `...` |
| `Push` | `PUSH` | o texto em maiúsculas |

**Entrada**

- Linha 1: o número de notificações `n`
- Depois `n` linhas: um tipo (`email`, `sms` ou `push`), um destinatário (sem espaços) e o texto (o resto da linha)

**Saída**

O que `send` devolve para cada notificação, em ordem:

```
EMAIL to ana@example.org: Your order has shipped
SMS to +5511999990000: Your code: 4821
PUSH to bia: MEETING AT 3PM
```

**Bom saber**

- `abstract class Notification` não pode ser criada com `new Notification(...)`, mas `new Email(...)` funciona, e uma variável `Notification` pode guardá-lo.
- Um método abstrato não tem corpo: `abstract String channel();`. Toda subclasse precisa escrevê-lo, senão o compilador recusa.
- O construtor da subclasse chama primeiro o do pai: `Email(String to) { super(to); }`.
- `line.split(" ", 3)` divide uma linha em no máximo 3 pedaços, então o texto mantém os espaços.
- Use `toUpperCase(Locale.ROOT)` para as maiúsculas não dependerem do idioma do computador.

> **Java clássico:** escreva as suas classes no mesmo arquivo `Main.java`, acima ou abaixo de `public class Main`, *sem* a palavra `public`.
