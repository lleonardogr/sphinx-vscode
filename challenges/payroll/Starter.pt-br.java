abstract class Employee {
    private final String name;

    Employee(String name) {
        this.name = name;
    }

    String getName() {
        return name;
    }

    abstract String type();

    abstract double pay();
}

class Salaried extends Employee {
    private final double monthly;

    Salaried(String name, double monthly) {
        super(name);
        this.monthly = monthly;
    }

    String type() {
        return "Salaried";
    }

    double pay() {
        return monthly;
    }
}

// TODO: classe Hourly extends Employee: valor por hora; horas acima de 160 valem 1,5x

// TODO: classe Commissioned extends Employee: salário base mais uma porcentagem das vendas

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<Employee> staff = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        if (p[0].equals("salaried")) {
            staff.add(new Salaried(p[1], Double.parseDouble(p[2])));
        }
        // TODO: crie também os funcionários Hourly e Commissioned
    }

    // TODO: imprima o pagamento de cada funcionário, depois o total da folha e quem ganha mais
}
