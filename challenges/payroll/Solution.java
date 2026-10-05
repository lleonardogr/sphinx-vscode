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

class Hourly extends Employee {
    private final double rate;
    private final int hours;

    Hourly(String name, double rate, int hours) {
        super(name);
        this.rate = rate;
        this.hours = hours;
    }

    String type() {
        return "Hourly";
    }

    double pay() {
        int extra = Math.max(0, hours - 160);
        return (hours - extra) * rate + extra * rate * 1.5;
    }
}

class Commissioned extends Employee {
    private final double base;
    private final double sales;
    private final double percent;

    Commissioned(String name, double base, double sales, double percent) {
        super(name);
        this.base = base;
        this.sales = sales;
        this.percent = percent;
    }

    String type() {
        return "Commissioned";
    }

    double pay() {
        return base + sales * percent / 100;
    }
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<Employee> staff = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        switch (p[0]) {
            case "salaried" -> staff.add(new Salaried(p[1], Double.parseDouble(p[2])));
            case "hourly" -> staff.add(new Hourly(p[1], Double.parseDouble(p[2]), Integer.parseInt(p[3])));
            default -> staff.add(new Commissioned(p[1], Double.parseDouble(p[2]), Double.parseDouble(p[3]), Double.parseDouble(p[4])));
        }
    }
    double total = 0;
    Employee top = staff.get(0);
    for (Employee e : staff) {
        IO.println("%s (%s): %.2f".formatted(e.getName(), e.type(), e.pay()));
        total += e.pay();
        if (e.pay() > top.pay()) top = e;
    }
    IO.println("Total payroll: %.2f".formatted(total));
    IO.println("Top earner: " + top.getName());
}
