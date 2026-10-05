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

// TODO: class Hourly extends Employee: rate per hour; hours over 160 are paid 1.5x

// TODO: class Commissioned extends Employee: base salary plus a percentage of sales

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<Employee> staff = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        if (p[0].equals("salaried")) {
            staff.add(new Salaried(p[1], Double.parseDouble(p[2])));
        }
        // TODO: create Hourly and Commissioned employees too
    }

    // TODO: print every employee's pay, then the total payroll and the top earner
}
