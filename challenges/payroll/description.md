# Payroll (Polymorphism)

A company pays three kinds of employees in different ways:

| Kind | Input | Pay |
|------|-------|-----|
| salaried | `salaried NAME MONTHLY` | the monthly salary |
| hourly | `hourly NAME RATE HOURS` | `RATE` per hour; every hour beyond 160 pays `1.5 × RATE` |
| commissioned | `commission NAME BASE SALES PERCENT` | `BASE` plus `PERCENT`% of `SALES` |

`Employee` and `Salaried` are written. Create `Hourly` and `Commissioned`, then print the payroll:

```
Ana (Salaried): 5000.00
Bruno (Hourly): 4375.00
Carla (Commissioned): 3500.00
Total payroll: 12875.00
Top earner: Ana
```

**Input**

- Line 1: `n`, the number of employees (at least 1)
- Then `n` lines as in the table

**Output**

One line per employee in input order, then the total and the top earner (the first one, if there is a tie). Amounts have two decimals.

**Things to know**

- An **abstract** class can't be created with `new`; its subclasses fill in the abstract methods.
- **Polymorphism**: a `List<Employee>` can hold any subclass, and `e.pay()` runs the version of the object's real class.
- Each subclass constructor must call `super(name)` first, to set up the part that belongs to `Employee`.
