# Folha de pagamento (polimorfismo)

Uma empresa paga três tipos de funcionários de jeitos diferentes:

| Tipo | Entrada | Pagamento |
|------|---------|-----------|
| assalariado | `salaried NAME MONTHLY` | o salário mensal |
| horista | `hourly NAME RATE HOURS` | `RATE` por hora; cada hora acima de 160 paga `1,5 × RATE` |
| comissionado | `commission NAME BASE SALES PERCENT` | `BASE` mais `PERCENT`% de `SALES` |

`Employee` e `Salaried` estão prontos. Crie `Hourly` e `Commissioned` e imprima a folha:

```
Ana (Salaried): 5000.00
Bruno (Hourly): 4375.00
Carla (Commissioned): 3500.00
Total payroll: 12875.00
Top earner: Ana
```

**Entrada**

- Linha 1: `n`, o número de funcionários (pelo menos 1)
- Depois, `n` linhas como na tabela

**Saída**

Uma linha por funcionário na ordem da entrada, depois o total e quem ganha mais (o primeiro, se houver empate). Os valores têm duas casas decimais.

**O que você precisa saber**

- Uma classe **abstrata** não pode ser criada com `new`; as subclasses preenchem os métodos abstratos.
- **Polimorfismo**: uma `List<Employee>` aceita qualquer subclasse, e `e.pay()` roda a versão da classe real do objeto.
- O construtor de cada subclasse precisa chamar `super(name)` primeiro, para montar a parte que pertence a `Employee`.
